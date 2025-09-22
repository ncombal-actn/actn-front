# ActnFrontEnd TEST 221
# PROTOCOL DE DEPLOIEMENT DU SITE ACTN SUR LE SERVEUR DE TEST 192.168.230.221

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 12.2.4.
Dernière modification apportée à ce document le 09/08/2022 par Joffrey Jeunehomme

# Merger et remonter ses commits et modifications git sur les branches de test et deploiement test 'dev' & 'ssr-dev'

## 1.1
## Mettre à jour votre branche sur le repository git distant
(Sur votre branche personnelle, supposément utilisée uniquement par vous même)
 - (Optionnel) Afficher un compte rendu clair de l'état actuel de votre branche :  `git status`
 - Ajouter toutes les modifications et fichiers non tracés au stage local : `git add --all` (il peut être nécéssaire de ne pas tout ajouter aveuglément dans certains cas, auquel cas n'utilisez pas `--all`)
 - Ajouter les  dernières modifications au repository local : `git commit -am "{commentaire du commit}"` (utiliser un commentaire clair, décrivant ce que contient le commit est fortement encouragé)
 - Mettre à jour le repository distant avec les derniers commit `git push`

## 1.2
## Merger sur la branche de test
 - Se déplacer sur la branche de test 'dev' : `git checkout dev`
 - Une fois sur la branche de test, mettre à jour la branche avec toutes les dernières modifications du repository distant : `git pull`
 - Une fois la branche à jour avec le repository distant, appliquer les modifications faites sur votre branche personnelle sur la branche de test : `git merge {nom de votre branche personnelle}`
 - (Optionnel) Afficher un clair compte rendu du status de la branche après l'opération précédente :  `git status`
 - (IF MERGE CONFLICT) Résoudre les conflits avec l'outil de votre choix, puis commit les modifications de la résolutions : `git add --all` ( en supposant que vous voulez ajouter tous les fichiers du projet avant de commit ) puis `git commit` (le message par defaut du commit de merge peut être laissé tel quel)
 - Mettre à jour la brache maintenant modifiée sur le repository distant : `git push`
 - (Optionnel mais conseillé) Vérifier que le projet est encore fonctionnel après le merge, en cas d'erreurs il sera plus simple de les corriger ici avant l'étape suivante : `ng serve`

## 1.3
## Merger sur la branche test de déploiement
 - Se déplacer sur la branche de test et deploiement 'ssr-dev' : `git checkout ssr-dev`
 - Une fois sur la branche de test et deploiement, mettre à jour la branche avec toutes les dernières modifications du repository distant : `git pull`
 - Une fois la branche à jour avec le repository distant, appliquer les modifications de 'dev' sur la branche de test et deploiement 'ssr-dev' : `git merge dev`
 - (Optionnel) Afficher un clair compte rendu du status de la branche après l'opération précédente :  `git status`
 - (IF MERGE CONFLICT) Résoudre les conflits avec l'outil de votre choix, puis commit les modifications de la résolutions : `git add --all` ( en supposant que vous voulez ajouter tous les fichiers du projet avant de commit ) puis `git commit` (le message par defaut du commit de merge peut être laissé tel quel)
 - Mettre à jour la brache maintenant modifiée sur le repository distant : `git push`

/!\ En tant qu'environements de tests isolés, rien de doit sortir de ces branches.
/!\ Les modifications / commits faits sur 'dev' et 'ssr-dev' ne doivent en aucun cas être merge en dehors. Strictement suivre l'ordre suivant 'maBranche' => 'dev' => 'ssr-dev'.
/!\ Si nécéssaire, écrasser les branches et re-créez 'dev' à partir de 'master' et 'ssr-dev' à partir de 'ssr' respectivement.

# Compiler le projet de site et déployer sur le serveur test 192.168.230.221

## 2.1
## Compiler le projet et le préparer à être déployé en mode test
(Sur la branche de deploiement de test 'ssr-dev', supposément précédemment mise à jours avec des modifications à tester dans un environement similaire à celui de la production)
 - Compiler le projet en mode test : `ng build --configuration test`
 - Un fois la compilation terminée sans erreurs, accéder au projet compilé dans `actn-front-end/dist/actn-front-end/browser`
 - Ici, créer une copie de 'index.html' et renomez-la 'index.original.html'

## 2.2
## Déployer le projet compilé sur le serveur de test
 - (Dans une autre fenetre) Accéder au dossier du projet déployé sur le serveur de test '192.168.230.221/www/actn/'
 - (Optionnel) Sauvegardez une copie du projet déjà déployé dans '192.168.230.221/www/actn-previous-backup' (très utile en production si le déploiement échoue)
 - Dans '192.168.230.221/www/actn/', supprimer uniquement le **dossier** '/assets', ainsi que tous les **fichiers** à la racine du projet à l'exception de 'config.php'
 - Copier ensuite le contenu du projet précédemment compilé dans 'actn-front-end/dist/actn-front-end/browser/' sur '192.168.230.221/www/actn/'
 - Tester ensuite le site dans un navigateur internet à l'adresse : `http://192.168.230.221/actn`
