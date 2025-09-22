/**
 * Constante d'environnement contenant les valeurs fixes, nécéssaire au bon fonctionnement du site déployé en production
 */
export const environment = {
	logs: false, // pas encore utilisé, supposé indiquer si oui on non on lance les 'console.log' dans l'app

	/**
	 * Est ce que le site est en mode production
	 */
	production: true,

	/**
	 * Position de la racine du projet Angular
	 */
	root: "/",

	/**
	 * URL du dossier 'backend', racine de multitude de fichiers nécéssaires au site
	 */
	backend: 'https://www.actn.fr/backend/',

	/**
	 * Position URL absolue des fichiers requete de l'API
	 */
	apiUrl: 'https://www.actn.fr/backend/api/',

	/**
	 * Position URL absolue des fichiers requete cachable de l'API
	 */
	cacheApiUrl: 'https://www.actn.fr/backend/api/cachable/',

	/**
	 * Position URL absolue des fichiers textes de l'aideRMA
	 */
	aideRMAUrl: 'https://www.actn.fr/backend/aideRMA/',

	/**
	 * Position URL absolue des images de produits en taille rééle
	 */
	photosUrl: 'https://www.actn.fr/backend/photos/reel/',
	/**
	 * Position URL absolue des images de produits en taille réduite
	 */
	vignettesUrl: 'https://www.actn.fr/backend/photos/vignettes/',

	/**
	 * Position URL absolue du dossier racine des logos de marques
	 */
	logoMarquesUrl: 'https://www.actn.fr/backend/marque/',
	/**
	 * Position URL absolue des logos de marques de 170 par 30 pixels en couleur
	 * Le logo placé en bas du cadre de l'image
	 */
	logoMarquesUrl70x30down: 'https://www.actn.fr/backend/marque/70x30/',
	/**
	 * Position URL absolue des logos de marques de 170 par 30 pixels en couleur
	 * Le logo placé au centre du cadre de l'image
	 */
	logoMarquesUrl70x30center: 'https://www.actn.fr/backend/marque/70x30center/',
	/**
	 * Position URL absolue des logos de marques de 200 par 80 pixels en teinte de gris
	 */
	logoMarquesGrisUrl: 'https://www.actn.fr/backend/marque/gris/200x80/',
	/**
	 * Position URL absolue des logos de marques de 200 par 80 pixels en teinte de gris
	 */
	logoMarquesGrisUrlLabel: 'https://www.actn.fr/backend/marque/gris/200x80long/',
	/**
	 * Position URL absolue des logos de marques de 200 par 80 pixels en couleur
	 */
	logoMarquesCouleurs200x80: 'https://www.actn.fr/backend/marque/200x80/COULEUR/',

	/**
	 * Position URL absolue du dossier contenant les images du CarouselComponent, ses URLs associées et le mode du Carousel
	 */
	carouselUrl: 'https://www.actn.fr/backend/imgcarroussel/',

	/**
	 * Position URL absolue de l'image par défaut des produit
	 * Affichée quand aucune image n'est trouvé pour un produit
	 */
	produitDefautImgUrl: 'https://www.actn.fr/backend/photos/reel/produit-dft.webp',
	/**
	 * Position URL absolue de l'image par défaut des produit virtuels
	 * Affichée quand aucune image n'est trouvé pour un produit
	 */
	produitVirtuelDefautImgUrl: 'https://www.actn.fr/backend/photos/reel/produit-dft-virtuel.webp',

	pdfUrl: 'https://www.actn.fr/backend/plaquettes/',
	produitPdfUrl: 'https://www.actn.fr/backend/pdf/',
	commandePdfUrl: 'https://www.actn.fr/backend/document/',
	captchaUrl: 'http://www.actn.fr/backend/api/Captcha.php',
	pagesHtml: 'https://www.actn.fr/backend/pageshtml/',
	htmlLibre: 'https://www.actn.fr/backend/htmllibre/',
	banniereUrl: 'https://www.actn.fr/backend/bannieres/',
	aideChoix: 'https://www.actn.fr/backend/aidechoix/',
	recrutement: 'https://www.actn.fr/backend/recrutement/',
	configurateurZyxel: 'https://www.actn.fr/backend/configurateur/ZYXEL/',
	configurateurSonicWall: 'https://www.actn.fr/backend/configurateur/SONICWALL/',
	prestations: 'https://www.actn.fr/backend/prestations/',
	focusPath: "https://www.actn.fr/backend/focus/",
	img: "https://www.actn.fr/backend/img/",
	backendImageFolder: "https://www.actn.fr/backend/img/",
	/**
	 * Le nombre de jours en dessous duquel la cotation deviens critique si elle lui reste des produits non-commandés
	 */
	daysLeftForCotationToBeCritical: 14,
	/**
	 * Cap au delas duquel il n'y a plus de franco et le montant de franco deviens infinit
	 */
	maxFranco: 99999,
    COOKIE_TOKEN: 'zRe4eg4e98R4g2D1s6d8G4zrg7z4FF4SFqs5f4HZRH',
  recaptcha: {
    siteKey: '6LcQMGQqAAAAAGWJiCmYrOyTWCLg0Rmd6y6ZT5K7',
  },
};
