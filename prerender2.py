"""Script de prérendu du site web

Ce script s'occupe de générer le site, les nouveaux contenus et de
supprimer les pages obsolètes.

Il est possible de l'utiliser sur le serveur de prod ou de dev en
spécifiant dev ou prod à l'exécution.

Usage: prerender.py <target>
	target: prod ou dev
"""

import re
import shutil
import os
import subprocess
import sys
import xml.etree.ElementTree as XML

# Paramétrage
if len(sys.argv) != 4 and len(sys.argv) != 5 :
	print("Usage: prerender2.py <target> <mode> <copy> [<sitemappath>]")
	print("target: prod | dev")
	print("mode: all (pour générer l'application et les nouvelles fiches produits) | app (ne générer que l'application)")
	print("copy: yes | no (indique si le script doit supprimer l'ancien contenu et copier le nouveau)")
	print("sitemappath: l'url de la sitemap sur laquelle s'appuyer pour générer les fiches produit. Requis seulement si mode == 'all'")
	exit(1)
else:
	env = sys.argv[1]
	mode = sys.argv[2]
	copy = sys.argv[3]
	if mode == "all":
		if len(sys.argv) != 5:
			print("mode was set to 'all', the sitemappath parameter is required")
			exit(1)
		else:
			sitemappath = sys.argv[4]

def check(l1, l2):
	""" Ne conserve que les lignes de f2 non présentes dans f1. """
	return [line for line in l2 if line not in l1]

def liste_existant():
	""" Liste le contenu généré dans actn/catalogue. """
	print("# Découverte du contenu déjà généré #")
	actuel = []
	p = re.compile("^\./actn")
	for root, dirs, _ in os.walk("./actn/catalogue"):
		for dir in dirs:
			actuel.append(p.sub("", os.path.join(root, dir)))
	p = re.compile('\\\\')
	actuel = [p.sub('/', line) + "\n" for line in actuel]
	with open("actuel.txt", "w", encoding="utf-8") as f:
		f.writelines(actuel)
	return actuel

def clean_sitemap(filepath):
	""" Nettoie le sitemap. """
	print("# Nettoyage du sitemap.txt #")
	sitemap = []
	if (re.compile(".+\.xml$").match(filepath)):
		for child in XML.parse(filepath).iter("{http://www.google.com/schemas/sitemap/0.84}loc"):
			sitemap.append(child.text + '\n')
			# print(child.text)
	else:
		# boucle de parse avec xslx
		fp = open(filepath, "r", encoding="utf-8")
		if fp:
			line = fp.readline()
			while line:
				sitemap.append(line + '\n')
				line = fp.readline()
		else:
			print("failed to open filepath")
			exit(1)
	# print(sitemap)
	# print(type(sitemap))
	# Suppression de https://www_actn_fr/actn
	p = re.compile('https://www.actn.fr/actn')
	sitemap = [p.sub('', line) for line in sitemap]
	# Suppression des caractères non attendus, principalement des " perdus
	p = re.compile('(^")|("$)')
	sitemap = [p.sub('', line) for line in sitemap]
	p = re.compile('""')
	sitemap = [p.sub('"', line) for line in sitemap]
	# Suppression des NBSP
	p = re.compile('\xC2\xA0')
	sitemap = [p.sub('', line) for line in sitemap]
	# Suppression des lignes qui ne commencent par par /
	p = re.compile('^/')
	sitemap = [line for line in sitemap if p.search(line) != None]
	# Supprime les \n en trop en fin de ligne
	p = re.compile("(\n\n)$")
	sitemap = [p.sub('\n', line) for line in sitemap]
	# Ajoute les catégories, familles, sous-familles
	p = re.compile('^(((/([^/]*)(?=/)){4}).*)$')
	x = []
	for line in sitemap:
		if p.search(line) != None:
			print(line)
			x.append(line)
			x.append(p.sub('\\2', line))
	p = re.compile('^(((/([^/]*)(?=/)){3}).*)$')
	for line in sitemap:
		if p.search(line) != None:
			x.append(p.sub('\\2', line))
	p = re.compile('^(((/([^/]*)(?=/)){2}).*)$')
	for line in sitemap:
		if p.search(line) != None:
			x.append(p.sub('\\2', line))
	sitemap = list(set(x))
	# Ajoute tous les /unique
	p = re.compile('^((/([^/]*/){3}).*)$')
	x = []
	for line in sitemap:
		if p.search(line) != None:
			x.append(line)
			x.append(p.sub('\\2unique', line))
		else:
			x.append(line)
	sitemap = list(set(x))
	# Transforme les // en /_/
	p = re.compile("/(.|/)(?=/|$)")
	sitemap = [p.sub('/_', line) for line in sitemap]
	# Transforme les &amp; en &
	p = re.compile("&amp;")
	sitemap = [p.sub('&', line) for line in sitemap]
	# Supprime les / terminaux
	p = re.compile("/\n")
	sitemap = [p.sub('\n', line) for line in sitemap]
	# Supprime les doublons
	sitemap.sort()
	# print("\n")
	print(sitemap)
	print("\n")
	# print("\n")
	# print(type(sitemap))

	return sitemap

def verif_nouveau_produits(actuel, sitemap):
	""" Compare les éléments générés au sitemap pour extraire les nouvelles fiches produits à générer. """
	print("# Découverte des nouveaux éléments #")
	new = []
	new = check(actuel, sitemap)
	new.append("/\n")
	new.append("/accueil")
	with open("new.txt", "w", encoding="utf-8") as n:
		n.writelines(new)
	print(f" - {len(new)} nouveaux éléments à générer")
	return new

def verif_ancien_produits(actuel, sitemap):
	""" Compare les éléments générés au sitemap pour extraire les fiches produits qui n'en font plus partie. """
	print("# Découverte des éléments obsolètes (renommés, déplacés ou supprimés) #")
	old = []
	old = check(sitemap, actuel)
	with open("old.txt", "w", encoding="utf-8") as n:
		n.writelines(old)
	print(f" - {len(old)} éléments obsolètes à supprimer")
	return old

def trouver_main():
	""" Recherche le nom du fichier main.xxx.js généré lors de la création de l'application. """
	p = re.compile("^main.[a-z0-9]*.js$")
	main = ""
	for _, _, files in os.walk("./dist"):
		for file in files:
			if p.search(file) != None:
				main = file
				break
		if len(main) > 0:
			break
	return main

def generer_app():
	""" Génère l'application. """
	# Génération des pages web
	print("# Génération des pages web #")
	os.chdir("./actn-source-code")
	# Mise à jour du code
	print(" - Mise à jour de git")
	subprocess.run(["git", "branch"], capture_output=False)
	subprocess.run(["git", "reset", "--hard"], capture_output=False)
	if env == 'dev':
		subprocess.run(["git", "checkout", "ssr-dev"], capture_output=False)
		subprocess.run(["git", "fetch", "origin", "ssr-dev"], capture_output=False)
		subprocess.run(["git", "reset", "--hard", "origin/ssr-dev"], capture_output=False)
	if env == 'prod':
		subprocess.run(["git", "checkout", "ssr"], capture_output=False)
		subprocess.run(["git", "fetch", "origin", "ssr"], capture_output=False)
		subprocess.run(["git", "reset", "--hard", "origin/ssr"], capture_output=False)
	# Génération du site
	print(" - Génération de l'application")
	if env == 'dev':
		subprocess.run("ng run actn-front-end:prerender-beta --routes \"/\"", shell=True, capture_output=False)
	if env == 'prod':
		subprocess.run("ng run actn-front-end:prerender --routes \"/\"", shell=True, capture_output=False)
	main = trouver_main()
	print("# MAIN : #")
	print(main)
	subprocess.run(f"node .\\prerender.js index.html .\\dist\\actn-front-end\\server\\{main} .\\dist\\actn-front-end\\browser\\ \"/\"", shell=True, capture_output=False)

def generer_produits(new):
	""" Génère les nouvelles fiches produits. """
	print(" - Génération du nouveau contenu")
	main = trouver_main()
	c = len(new)
	for index, file in enumerate(new, start=1):
		print(f"Generating {index}/{c}: {file.strip()}", end="                                                             \r")
		subprocess.run(f"node .\\prerender.js index.html .\\dist\\actn-front-end\\server\\{main} .\\dist\\actn-front-end\\browser\\ \"{file}\"", shell=True, capture_output=True)

def modif_nouvelles_pages():
	""" Modifie les pages générées. """
	print("# Modification des pages générées #                                                   ")
	# Remplace les liens css
	css = re.compile("<link rel=\"stylesheet\" href=\"styles.[a-z0-9]*.css\" media=\"print\" onload=\"this.media='all'\">")
	css2 = re.compile("<link rel=\"stylesheet\" href=\"styles.[a-z0-9]*.css\">")
	# Remplace les scripts
	hashed_script = re.compile("<script src=\"runtime-es2015.[a-z0-9]*.js\" type=\"module\"></script><script src=\"runtime-es5.[a-z0-9]*.js\" nomodule=\"\" defer=\"\"></script><script src=\"polyfills-es5.[a-z0-9]*.js\" nomodule=\"\" defer=\"\"></script><script src=\"polyfills-es2015.[a-z0-9]*.js\" type=\"module\"></script><script src=\"main-es2015.[a-z0-9]*.js\" type=\"module\"></script><script src=\"main-es5.[a-z0-9]*.js\" nomodule=\"\" defer=\"\"></script>")
	# Ne modifie que les fichiers .html
	html = re.compile("\.html$")
	# S'assure de convertir tous les liens de 221 vers www.actn.fr
	link = re.compile("http://192.168.230.221/")
	# Supprime les icônes géantes (cogs et star)
	icons = re.compile("(<fa-icon[^M]*((M512)|(M259))[^<]*((<\/path>)|(<\/g>)|(<\/svg>))*<\/fa-icon>)")
	# Racine de l'application
	root = "./dist/actn-front-end/browser"
	for path, dirs, files in os.walk(root):
		if path != root:
			for filename in files:
				filepath = os.path.join(path, filename)
				line_of_file = []
				line_of_file.append("<?php require $_SERVER[\"DOCUMENT_ROOT\"] . \"/actn/config.php\"; ?>\n")
				if html.search(filepath) != None:
					with open(filepath, "r", encoding="utf-8") as file:
						print(f"Altering {filepath}", end="                                                   \r")
						for line in file:
							line = css.sub("<?php echo \"<link rel=\\\"stylesheet\\\" href=\\\"styles.${css}.css\\\" media=\\\"print\\\" onload=\\\"this.media='all'\\\">\" ?>", line)
							line = css2.sub("<?php echo \"<link rel=\\\"stylesheet\\\" href=\\\"styles.${css}.css\\\">\" ?>", line)
							line = hashed_script.sub("<?php echo \"<script src=\\\"runtime-es2015.${runtime_es2015}.js\\\" type=\\\"module\\\"></script><script src=\\\"runtime-es5.${runtime_es5}.js\\\" nomodule=\\\"\\\" defer=\\\"\\\"></script><script src=\\\"polyfills-es5.${polyfills_es5}.js\\\" nomodule=\\\"\\\" defer=\\\"\\\"></script><script src=\\\"polyfills-es2015.${polyfills_es2015}.js\\\" type=\\\"module\\\"></script><script src=\\\"main-es2015.${main_es2015}.js\\\" type=\\\"module\\\"></script><script src=\\\"main-es5.${main_es5}.js\\\" nomodule=\\\"\\\" defer=\\\"\\\"></script>\" ?>", line)
							line = icons.sub("", line)
							if env == 'prod':
								line = link.sub("https://www.actn.fr/", line)
							line_of_file.append(line)
					os.remove(filepath)
					with open(html.sub(".php", filepath), "w", encoding="utf-8") as file:
						file.writelines(line_of_file)
	# On enlève les icones à la con dans les index de la racine aussi
	indexes = ["index.html", "index.original.html"]
	for index in indexes:
		filepath = root + "/" + index
		line_of_file = []
		with open(filepath, "r", encoding="utf-8") as file:
			for line in file:
				line = icons.sub("", line)
				line_of_file.append(line)
		os.remove(filepath)
		with open(filepath, "w", encoding="utf-8") as file:
			file.writelines(line_of_file)

def supprime_ancien_contenu(old):
	""" Supprime les pages obsolètes (déplacées ou supprimées). """
	print("# Suppression de l'ancien contenu #                                                        ")
	print(" - Suppression du contenu obsolète")
	p = re.compile("\n")
	for line in old:
		shutil.rmtree("./actn" + p.sub("", line), ignore_errors=True)
	print(" - Suppression de l'application")
	
def supprime_ancienne_app():
	with os.scandir("./actn") as entries:
		for entry in entries:
			if entry.is_file() and (entry.name != "config.php"):
				os.remove(os.path.join("./actn", entry.name))
	shutil.rmtree("./actn/assets")

def copie_nouvelle_app():
	print("# Copie du nouveau contenu #")
	p = re.compile("./actn-source-code/dist/actn-front-end/browser")
	q = re.compile("\\\\")
	for root, _, files in os.walk("./actn-source-code/dist/actn-front-end/browser"):
		for file in files:
			dst = q.sub("/", "./actn/" + p.sub("", root))
			src = q.sub("/", os.path.join(root, file))
			print(f"Copying {os.path.join(dst, file)}", end="                                                   \r")
			os.makedirs(dst, exist_ok=True)
			shutil.copy2(src, dst)

def save():
	""" Effectue une sauvegarde. """
	print("# Sauvegarde de l'application #")
	shutil.rmtree("actn-previous-backup/auto")
	shutil.copytree("actn", "actn-previous-backup/auto")

print("# Début du script de prérendu #")
if env == "dev":
	print("# Mode développement #")
if env == "prod":
	print("# Mode production #")

if mode == "all":
	sitemap = clean_sitemap(sitemappath)
	actuel = liste_existant()
	new = verif_nouveau_produits(actuel, sitemap)
	old = verif_ancien_produits(actuel, sitemap)
	with open("sitemap.txt", "w", encoding="utf-8") as f:
		f.writelines(sitemap)
	with open("actuel.txt", "w", encoding="utf-8") as f:
		f.writelines(actuel)
	with open("new.txt", "w", encoding="utf-8") as f:
		f.writelines(new)
	with open("old.txt", "w", encoding="utf-8") as f:
		f.writelines(old)
	generer_app()
	generer_produits(new)
	modif_nouvelles_pages()
	os.chdir("..")
	# save()
	if copy == "yes":
		supprime_ancien_contenu(old)
		supprime_ancienne_app()
		copie_nouvelle_app()
elif mode == "app":
	generer_app()
	modif_nouvelles_pages()
	os.chdir("..")
	if copy == "yes":
		supprime_ancienne_app()
		copie_nouvelle_app()

print("# Fin du script de prérendu #                                                   \a")
