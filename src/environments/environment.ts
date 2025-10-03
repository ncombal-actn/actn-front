/**
 * Constante d'environnement contenant les valeurs fixes, nécéssaire au bon fonctionnement du site déployé en production
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
	backend: 'https://beta.actn.fr/backend/',

	/**
	 * Position URL absolue des fichiers requete de l'API
	 */
	apiUrl: 'https://beta.actn.fr/backend/api/',

	/**
	 * Position URL absolue des fichiers requete cachable de l'API 
	 */
	cacheApiUrl: 'https://beta.actn.fr/backend/api/cachable/',


	/**
	 * Position URL absolue des fichiers textes de l'aideRMA
	 */
	aideRMAUrl: 'https://beta.actn.fr/backend/aideRMA/',

	/**
	 * Position URL absolue des images de produits en taille rééle
	 */
	photosUrl: 'https://beta.actn.fr/CommunWeb/photos/reel/',
	/**
	 * Position URL absolue des images de produits en taille réduite
	 */
	vignettesUrl: 'https://beta.actn.fr/CommunWeb/photos/vignettes/',

	/**
	 * Position URL absolue du dossier racine des logos de marques
	 */
	logoMarquesUrl: 'https://beta.actn.fr/CommunWeb/marque/',
	/**
	 * Position URL absolue des logos de marques de 170 par 30 pixels en couleur
	 * Le logo placé en bas du cadre de l'image
	 */
	logoMarquesUrl70x30down: 'https://beta.actn.fr/CommunWeb/marque/70x30/',
	/**
	 * Position URL absolue des logos de marques de 170 par 30 pixels en couleur
	 * Le logo placé au centre du cadre de l'image
	 */
	logoMarquesUrl70x30center: 'https://beta.actn.fr/CommunWeb/marque/70x30center/',
	/**
	 * Position URL absolue des logos de marques de 200 par 80 pixels en teinte de gris
	 */
	logoMarquesGrisUrl: 'https://beta.actn.fr/CommunWeb/marque/gris/200x80/',
	/**
	 * Position URL absolue des logos de marques de 200 par 80 pixels en teinte de gris
	 */
	logoMarquesGrisUrlLabel: 'https://beta.actn.fr/CommunWeb/marque/gris/200x80long/',
	/**
	 * Position URL absolue des logos de marques de 200 par 80 pixels en couleur
	 */
	logoMarquesCouleurs200x80: 'https://beta.actn.fr/CommunWeb/marque/200x80/COULEUR/',

	/**
	 * Position URL absolue du dossier contenant les images du CarouselComponent, ses URLs associées et le mode du Carousel
	 */
	carouselUrl: 'https://beta.actn.fr/CommunWeb/imgcarroussel/',

	/**
	 * Position URL absolue de l'image par défaut des produit
	 * Affichée quand aucune image n'est trouvé pour un produit
	 */
	produitDefautImgUrl: 'https://beta.actn.fr/CommunWeb/photos/reel/produit-dft.webp',
	/**
	 * Position URL absolue de l'image par défaut des produit virtuels
	 * Affichée quand aucune image n'est trouvé pour un produit
	 */
	produitVirtuelDefautImgUrl: 'https://beta.actn.fr/CommunWeb/photos/reel/produit-dft-virtuel.webp',

	pdfUrl: 'https://beta.actn.fr/CommunWeb/plaquettes/',
	produitPdfUrl: 'https://beta.actn.fr/CommunWeb/pdf/',
	commandePdfUrl: 'https://beta.actn.fr/CommunWeb/document/',
	captchaUrl: 'https://beta.actn.fr/backend/api/Captcha.php',
	pagesHtml: 'https://beta.actn.fr/CommunWeb/pageshtml/',
	htmlLibre: 'https://beta.actn.fr/CommunWeb/htmllibre/',
	banniereUrl: 'https://beta.actn.fr/CommunWeb/bannieres/',
	aideChoix: 'https://beta.actn.fr/backend/aidechoix/',

	prestations: 'https://beta.actn.fr/backend/prestations/',
	focusPath: "https://beta.actn.fr/backend/focus/",
	img: "https://beta.actn.fr/CommunWeb/img/",
	backendImageFolder: "https://beta.actn.fr/CommunWeb/img/",
	/**
	 * Le nombre de jours en dessous duquel la cotation deviens critique si elle lui reste des produits non-commandés
	 */
	daysLeftForCotationToBeCritical: 14,
	/**
	 * Cap au delas duquel il n'y a plus de franco et le montant de franco deviens infinit
	 */
	maxFranco: 99999,
	recrutement: 'https://beta.actn.fr/backend/recrutement/',
	configurateurZyxel: 'https://beta.actn.fr/CommunWeb/configurateur/ZYXEL/',
	COOKIE_TOKEN_CART: 'G6IF4uy4gfIs4dfh5QDuf654',
	recaptcha: {
	siteKey: '6LcQMGQqAAAAAGWJiCmYrOyTWCLg0Rmd6y6ZT5K7',
	},
};
