# ActnFrontEnd TEST 221
# PROTOCOL DE DEPLOIEMENT DU SITE ACTN SUR LE SERVEUR DE TEST 192.168.230.221

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 12.2.4.
Dernière modification apportée à ce document le 09/08/2022 par Joffrey Jeunehomme

# Merger et remonter ses commits et modifications git sur les branches 'master' (principale) et 'ssr' deploiement production

## 1.1
## Mettre à jour votre branche sur le repository git distant
(Sur votre branche personnelle, supposément utilisée uniquement par vous même)
 - (Optionnel) Afficher un compte rendu clair de l'état actuel de votre branche :  `git status`
 - Ajouter toutes les modifications et fichiers non tracés au stage local : `git add --all` (il peut être nécéssaire de ne pas tout ajouter aveuglément dans certains cas, auquel cas n'utilisez pas `--all`)
 - Ajouter les dernières modifications au repository **local** : `git commit -am "commentaire du commit"` (il est fortement encouragé d'utiliser un commentaire clair et décrivant ce que contient le commit)
 - Mettre à jour le repository **distant** avec les derniers commit `git push`

## 1.2
## Merger sur la branche principale
 - Se déplacer sur la branche de principale 'master' : `git checkout master`
 - Une fois sur la branche principale, mettre à jour la branche avec toutes les dernières modifications présentes dans le repository distant : `git pull`
 - Une fois la branche à jour avec le repository distant, appliquer les modifications faites sur votre branche personnelle sur la branche principale : `git merge {nom de votre branche personnelle}`
 - (Optionnel) Afficher un clair compte rendu du status de la branche après l'opération précédente :  `git status`
 - (IF MERGE CONFLICT) Résoudre les conflits avec l'outil de votre choix, puis commit les modifications de la résolutions : `git add --all` ( en supposant que vous voulez ajouter tous les fichiers du projet avant de commit ) puis `git commit` (le message par defaut du commit de merge peut être laissé tel quel)
 - Mettre à jour la brache maintenant modifiée sur le repository distant : `git push`
 - (Optionnel mais conseillé) Vérifier que le projet est encore fonctionnel après le merge, en cas d'erreurs il sera plus simple de les corriger ici avant l'étape suivante : `ng serve`

## 1.3
## Merger sur la branche test de déploiement en production
 - Se déplacer sur la branche de déploiement en production 'ssr' : `git checkout ssr`
 - Une fois sur la branche de déploiement en production, mettre à jour la branche avec toutes les dernières modifications du repository distant : `git pull`
 - Une fois la branche à jour avec le repository distant, appliquer les modifications de 'master' sur la branche de déploiement en production 'ssr' : `git merge master`
 - (Optionnel) Afficher un clair compte rendu du status de la branche après l'opération précédente :  `git status`
 - (IF MERGE CONFLICT) Résoudre les conflits avec l'outil de votre choix, puis commit les modifications de la résolutions : `git add --all` ( en supposant que vous voulez ajouter tous les fichiers du projet avant de commit ) puis `git commit` (le message par defaut du commit de merge peut être laissé tel quel)
 - Mettre à jour la brache maintenant modifiée sur le repository distant : `git push`

/!\ En tant qu'environement uniquement destiné au déploiement, il est fortement déconseillé de faire des modifications sur 'ssr' et de merger la banche sur une autre
/!\ Il est conseillé notamment pour des raisons de conflits et de tracabilité de suivre l'ordre suivant : 'maBranche' => 'master' => 'ssr'.

# Mettre à jour les fichier PHP édités sur l'api de production 192.168.230.202

 - Ne pas oublier "remonter" les scripts PHP modifiés ou créés et nécéssaires au bon fonctionnements du site depuis la denière remontée en production 202 
 - Copier les derniers PHP devant être remonté depuis l'environnement de test `192.168.230.221/www/backend/api/` 
 - Coller les PHP sur l'environnement de production `192.168.230.202/www/backend/api/` 

# Compiler le projet de site et déployer sur le serveur de production 192.168.230.202

## 2.1
## Compiler le projet et le préparer à être déployé en mode test
(Sur la branche de deploiement en production 'ssr', supposément précédemment mise à jours avec des modifications à déployer en production)
 - Compiler le projet en mode production : `ng build --configuration production`
 - Un fois la compilation terminée sans erreurs, accéder au projet compilé dans `actn-front-end/dist/actn-front-end/browser`
 - Ici, créer une copie de 'index.html' et renomez-la 'index.original.html'

## 2.2
## ( FACULTATIF ) Déployer le projet compilé sur le serveur TEST de production
 - (Dans une autre fenetre) Accéder au dossier TEST du projet déployé sur le serveur de prodution `192.168.230.202/www/__actn/`
 - Dans `http://www.actn/__actn/`, supprimer uniquement le **dossier** '/assets', ainsi que tous les **fichiers** à la racine du projet à l'exception de 'config.php'
 - Copier ensuite le contenu du projet précédemment compilé dans 'actn-front-end/dist/actn-front-end/browser/' sur '192.168.230.221/www/actn/'
 - Remplacer dans 'index.html' ET 'index.original.html' `<base href="/actn/">` en `<base href="/__actn/">` (ligne 22 le 25/08/2022)
 - Tester ensuite le site dans un navigateur internet à l'adresse : `http://www.actn/__actn/`
 /!\ Il est impossible d'accéder au le serveur TEST de production autrement que par la racine : `http://www.actn/__actn/`

## 2.3
## Déployer le projet compilé sur le serveur de 
 - (Dans une autre fenetre) Accéder au dossier du projet déployé sur le serveur de production `192.168.230.202/www/actn/`
 - (Optionnel mais **TRES CONSEILLÉ**) Sauvegardez une copie du projet déjà déployé ici dans '192.168.230.202/www/actn-previous-backup'
    (très utile en production si le déploiement échoue malgré tout et qu'il devient nécéssaire de rétablir rapidement le bon donctionnement du site)
 - Dans '192.168.230.202/www/actn/', supprimer uniquement le **dossier** '/assets', ainsi que tous les **fichiers** à la racine du projet à l'exception de 'config.php'
 - Copier ensuite le contenu du projet précédemment compilé dans 'actn-front-end/dist/actn-front-end/browser/' sur `192.168.230.202/www/actn/`
 - Tester ensuite le site dans un navigateur internet à l'adresse : `http://www.actn/actn/`
