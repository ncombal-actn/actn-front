const fs = require('fs');
const SitemapGenerator = require('sitemap-generator');

// Configure your Angular website URLs
const baseUrl = 'https://actn.fr';
const routes = [
    '/'
    ,'/accueil'
    ,'/catalogue/Cybersécurité'
    ,'/catalogue/Cybersécurité/Antivirus & Endpoint'
    ,'/catalogue/Cybersécurité/Antivirus & Endpoint/unique'
    ,'/catalogue/Cybersécurité/Authentification'
    ,'/catalogue/Cybersécurité/Authentification/unique'
    ,'/catalogue/Cybersécurité/Boitier VPN'
    ,'/catalogue/Cybersécurité/Boitier VPN/unique'
    ,'/catalogue/Cybersécurité/Encryption'
    ,'/catalogue/Télécom/Tél.Analogique'
    ,'/catalogue/Télécom/Tél.Analogique/unique'
    ,'/catalogue/Télécom/Tél.Analogique/DECT Analogiques'
    ,'/catalogue/Télécom/Téléphone IP filaire'
    ,'/catalogue/Télécom/Téléphone IP filaire/unique'
    ,'/catalogue/Télécom/Téléphone IP filaire/Accessoires'
    ,'/catalogue/Télécom/Téléphone IP filaire/Extension Garantie'
    ,'/catalogue/Télécom/Téléphone IP filaire/Module de touches'
    ,'/catalogue/Télécom/Téléphone IP filaire/Postes IP Filaires'
    ,'/catalogue/Télécom/Téléphone sans fil'
    ,'/catalogue/Télécom/Téléphone sans fil/unique'
    ,'/catalogue/Télécom/Téléphone sans fil/Accessoires'
    ,'/catalogue/Télécom/Téléphone sans fil/Borne SIP Multicell'
    ,'/catalogue/Télécom/Téléphone sans fil/Borne SIP Monocell'
    ,'/catalogue/Télécom/Téléphone sans fil/DECT'
    ,'/catalogue/Télécom/Téléphone sans fil/Répéteur DECT'
    ,'/catalogue/Télécom/Téléphone sans fil/Wifi SIP'
    ,'/catalogue/Télécom/Visioconférence'
    ,'/catalogue/Télécom/Visioconférence/unique'
    ,'/catalogue/Télécom/Visioconférence/Accessoires Visio'
    ,'/catalogue/Télécom/Visioconférence/Caméra'
    ,'/catalogue/Télécom/Visioconférence/Haut-parleur Micro'
    ,'/catalogue/Télécom/Visioconférence/Licences Visio'
    ,'/catalogue/Télécom/Visioconférence/Pack Visioconférence'
    ,'/catalogue/Formations'
    ,'/catalogue/Formations/Formations HIKVISION'
    ,'/catalogue/Formations/Formations HIKVISION/unique'
    ,'/catalogue/Formations/Formations MOBOTIX'
    ,'/catalogue/Formations/Formations MOBOTIX/unique'
    ,'/catalogue/Formations/Formations Sonicwall'
    ,'/catalogue/Formations/Formations Sonicwall/unique'

];

// Initialize the sitemap generator
const sitemap = SitemapGenerator({
  urls: routes.map(route => ({ url: baseUrl + route, changefreq: 'daily', priority: 0.7 })),
});

// Generate the sitemap
sitemap.toXML((err, xml) => {
  if (err) throw err;

  // Save the sitemap to a file
  fs.writeFileSync('sitemap.xml', xml);

});
