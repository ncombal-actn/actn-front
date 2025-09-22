import os
import argparse

# Parser les arguments en ligne de commande
parser = argparse.ArgumentParser(description='Supprimer les fichiers JPG et PNG.')
parser.add_argument('paths', nargs='+', type=str, help='Chemin(s) des répertoires ou fichiers à traiter')
args = parser.parse_args()

# Parcourir tous les chemins spécifiés
for path in args.paths:
    if os.path.isdir(path):
        # Cas où le chemin est un répertoire
        for root, dirs, files in os.walk(path):
            for file in files:
                if file.lower().endswith(('.jpg', '.png')):
                    image_path = os.path.join(root, file)

                    # Supprimer le fichier
                    try:
                        os.remove(image_path)
                        print(f"Supprimé {image_path}")
                    except Exception as e:
                        print(f"Erreur lors de la suppression de {image_path} :", str(e))
    elif os.path.isfile(path):
        # Cas où le chemin est un fichier
        if path.lower().endswith(('.jpg', '.png')):
            try:
                os.remove(path)
                print(f"Supprimé {path}")
            except Exception as e:
                print(f"Erreur lors de la suppression de {path} :", str(e))
    else:
        print(f"Chemin invalide : {path}")