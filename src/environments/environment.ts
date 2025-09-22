/**
 * Constante d'environnement contenant les valeurs fixes, nécéssaire au bon fonctionnement du site
 */
export const environment = {
	logs: true, // pas encore utilisé, supposé indiquer si oui on non on lance les 'console.log' dans l'app

	/**
	 * Est ce que le site est en mode production
	 */
	production: false,

	/**
	 * Position de la racine du projet Angular
	 */
	root: "/",

	/**
	 * URL du dossier 'backend', racine de multitude de fichiers nécéssaires au site
	 */
	backend: 'http://192.168.230.221/backend/',

	/**
	 * Position URL absolue des fichiers requete de l'API
	 */
	apiUrl: 'http://192.168.230.221/backend/api/',

	/**
	 * Position URL absolue des fichiers requete cachable de l'API 
	 */
	cacheApiUrl: 'http://192.168.230.221/backend/api/cachable/',

	/**
	 * Position URL absolue des fichiers textes de l'aideRMA
	 */
	aideRMAUrl: 'http://192.168.230.221/backend/aideRMA/',

	/**
	 * Position URL absolue des images de produits en taille rééle
	 */
	photosUrl: 'http://192.168.230.221/backend/photos/reel/',
	/**
	 * Position URL absolue des images de produits en taille réduite
	 */
	vignettesUrl: 'https://192.168.230.221/backend/photos/vignettes/',

	/**
	 * Position URL absolue du dossier racine des logos de marques
	 */
	logoMarquesUrl: 'http://192.168.230.221/backend/marque/',
	/**
	 * Position URL absolue des logos de marques de 170 par 30 pixels en couleur
	 * Le logo placé en bas du cadre de l'image
	 */
	logoMarquesUrl70x30down: 'http://192.168.230.221/backend/marque/70x30/',
	/**
	 * Position URL absolue des logos de marques de 170 par 30 pixels en couleur
	 * Le logo placé au centre du cadre de l'image
	 */
	logoMarquesUrl70x30center: 'http://192.168.230.221/backend/marque/70x30center/',
	/**
	 * Position URL absolue des logos de marques de 200 par 80 pixels en teinte de gris
	 */
	logoMarquesGrisUrl: 'http://192.168.230.221/backend/marque/gris/200x80/',
	/**
	 * Position URL absolue des logos de marques de 200 par 80 pixels en teinte de gris
	 */
	logoMarquesGrisUrlLabel: 'http://192.168.230.221/backend/marque/gris/200x80long/',
	/**
	 * Position URL absolue des logos de marques de 200 par 80 pixels en couleur
	 */
	logoMarquesCouleurs200x80: 'http://192.168.230.221/backend/marque/200x80/COULEUR/',

	/**
	 * Position URL absolue du dossier contenant les images du CarouselComponent, ses URLs associées et le mode du Carousel
	 */
	carouselUrl: 'http://192.168.230.221/backend/imgcarroussel/',

	/**
	 * Position URL absolue de l'image par défaut des produit
	 * Affichée quand aucune image n'est trouvé pour un produit
	 */
	produitDefautImgUrl: 'http://192.168.230.221/backend/photos/reel/produit-dft.webp',
	/**
	 * Position URL absolue de l'image par défaut des produit virtuels
	 * Affichée quand aucune image n'est trouvé pour un produit
	 */
	produitVirtuelDefautImgUrl: 'http://192.168.230.221/backend/photos/reel/produit-dft-virtuel.webp',

	pdfUrl: 'http://192.168.230.221/backend/plaquettes/',
	produitPdfUrl: 'http://192.168.230.221/backend/pdf/',
	commandePdfUrl: 'http://192.168.230.221/backend/document/',
	captchaUrl: 'http://www.actn.fr/backend/api/Captcha.php',
	pagesHtml: 'http://192.168.230.221/backend/pageshtml/',
	htmlLibre: 'http://192.168.230.221/backend/htmllibre/',
	banniereUrl: 'http://192.168.230.221/backend/bannieres/',
	aideChoix: 'http://192.168.230.221/backend/aidechoix/',
	recrutement: 'http://192.168.230.221/backend/recrutement/',
	configurateurZyxel: 'http://192.168.230.221/backend/configurateur/ZYXEL/',
	configurateurSonicWall: 'http://192.168.230.221/backend/configurateur/SONICWALL/',
	prestations: 'http://192.168.230.221/backend/prestations/',
	focusPath: "http://192.168.230.221/backend/focus/",
	img: "http://192.168.230.221/backend/img/",
	backendImageFolder: "http://192.168.230.221/backend/img/",

	/**
	 * Le nombre de jours en dessous duquel la cotation deviens critique si elle lui reste des produits non-commandés
	 */
	daysLeftForCotationToBeCritical: 14,

	/**
	 * Cap au delas duquel il n'y a plus de franco et le montant de franco deviens infinit
	 */
	maxFranco: 99999,
	COOKIE_TOKEN_CART: 'zRe4eg4e98R4g2D1s6d8G4zrg7z4FF4SFqs5f4HZRH',
	recaptcha: {
	  siteKey: '6LcQMGQqAAAAAGWJiCmYrOyTWCLg0Rmd6y6ZT5K7',
	},
};

// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
