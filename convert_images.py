import os
import argparse
from PIL import Image

# Parser les arguments en ligne de commande
parser = argparse.ArgumentParser(description='Convertir des images en format WebP.')
parser.add_argument('image_directory', type=str, help='Répertoire contenant les images')
args = parser.parse_args()

# Vérifier l'existence du répertoire spécifié
if not os.path.isdir(args.image_directory):
    print('Le répertoire spécifié n\'existe pas.')
    exit()

# Parcourir récursivement tous les fichiers dans le répertoire et les sous-dossiers
for root, dirs, files in os.walk(args.image_directory):
    for file in files:
        if file.lower().endswith(('.jpg', '.png')):
            image_path = os.path.join(root, file)
            webp_path = os.path.splitext(image_path)[0] + '.webp'

            # Convertir le fichier en WebP
            try:
                img = Image.open(image_path)
                img.save(webp_path, 'webp')
                print(f"Converti {image_path} en {webp_path}")
            except Exception as e:
                print(f"Erreur lors de la conversion de {image_path} :", str(e))
