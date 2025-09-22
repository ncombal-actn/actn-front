import { NgModule } from '@angular/core';
import {  RouterModule, Routes} from '@angular/router';
import { AccueilComponent } from './accueil/accueil.component';
import { LoginComponent } from './login/login.component';
import { OuvertureDeCompteComponent } from './ouverture-de-compte/ouverture-de-compte.component';
import { ComparateurComponent } from './comparateur/comparateur.component';
import { RessourcesComponent } from './ressources/ressources.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ConditionsGeneralesDeVenteComponent } from './conditions-generales-de-vente/conditions-generales-de-vente.component';
import { ConditionsSavComponent } from './conditions-sav/conditions-sav.component';
import { ObjDisplayComponent } from './obj-display/obj-display.component';
import { ExternalFileComponent } from './external-file/external-file.component';
import { AuthGuard } from '@/_core/_guards';
import { CharteComponent } from './charte/charte.component';
import { GrilleTransportComponent } from './_util/components/grille-transport/grille-transport.component';
import { IFrameComponent } from './_util/components/i-frame/i-frame.component';
import { FavorisComponent } from './favoris/favoris.component';
import { FocusComponent } from './focus/focus.component';
import { OuvertureDeCompteConfirmationComponent } from './ouverture-de-compte-confirmation/ouverture-de-compte-confirmation.component';
import { RecrutementComponent } from './recrutement/recrutement.component';
import { ValidationRecrutementComponent } from './recrutement/validation-recrutement/validation-recrutement.component';
import { DocumentManquantComponent } from './document-manquant/document-manquant.component';
import { FormulaireProjetVideosurveillanceComponent } from './formulaire-projet-videosurveillance/formulaire-projet-videosurveillance.component';
import { VideosurveillanceConfirmationComponent } from './formulaire-projet-videosurveillance/videosurveillance-confirmation/videosurveillance-confirmation.component';
import { OutilsComponent } from './outils/outils.component';
import { HikAxProComponent } from './ressources/hik-ax-pro/hik-ax-pro.component';
import { EchecReglementComponent } from './echec-reglement/echec-reglement.component';


export const routes: Routes = [

	{
		path: 'onlywan',

		loadChildren: () =>
		import('@/onlywan/onlywan.module').then((mod) => mod.OnlywanModule)
	},

	{
		path: 'charte',
		component: CharteComponent,
		data: {
			filDArianne: [{ url: 'charte', label: 'Charte graphique', guarded: true }],
		},
	},
	{
		path: 'recrutement',
		component: RecrutementComponent,
		data: {
			filDArianne: [{ url: 'recrutement', label: 'Recrutement', guarded: true }],
		},
	},
	{
		path: 'recrutement/validation-recrutement',
		component: ValidationRecrutementComponent,
		data: {
			filDArianne: [
				{ url: 'recrutement', label: 'Recrutement', guarded: false },
				{ url: 'validation-recrutement', label: 'Candidature transmise', guarded: true }
			],
		}
	},
	{
		path: 'document-non-trouve',
		component: DocumentManquantComponent,
		data: {
			filDArianne: [{ url: 'document-non-trouve', label: 'Document non trouvé', guarded: true }],
		},
	},
	{
		path: 'login',
		component: LoginComponent,
		data: {
			filDArianne: [{ url: 'login', label: 'Connexion', guarded: false }],
		},
	},
	{
		path: 'ouverture-de-compte',
		component: OuvertureDeCompteComponent,
		data: {
			filDArianne: [
				{ url: 'ouverture-de-compte', label: 'Demande d\'ouverture de compte', guarded: true },
			],
		},
	},
	{
		path: 'ouverture-de-compte-confirmation',
		component: OuvertureDeCompteConfirmationComponent,
		data: {
			filDArianne: [
				{ url: 'ouverture-de-compte-confirmation', label: 'Confirmation d\'ouverture de compte', guarded: true },
			],
		},
	},
	{
		path: 'mot-de-passe',
		loadChildren: () =>
		import('@/mot-de-passe/mot-de-passe.module').then((mod) => mod.MotDePasseModule)
	},
	{
		path: 'catalogue',
		loadChildren: () =>
		import('@/catalogue/catalogue.module').then((mod) => mod.CatalogueModule),
	},
	{
		path: 'comparateur',
		component: ComparateurComponent,
		data: {
			filDArianne: [{ url: 'comparateur', label: 'Comparateur', guarded: true }],
		},
	},
	{
		path: 'favoris',
		component: FavorisComponent,
		data: {
			filDArianne: [{ url: 'favoris', label: 'Favoris', guarded: true }],
		},
	},

	
	{
		path: 'prestations',
		loadChildren: () =>
		import('@/prestations/prestations.module').then((mod) => mod.PrestationsModule)
	},

	// Section Ressources.
	// Plusieurs pages à venir (présentation formations, sélecteurs, fiches tarifs par marque, ...).
	// Créer un module lazy loaded si la section devient conséquente.
	{
		path: 'ressources/Promotions',
		component: ExternalFileComponent,
		data: {
			filDArianne: [{ url: 'ressources', label: 'Promotions', guarded: true }],
		},
	},
	{
		path: 'actualite',
		component: IFrameComponent,
		data: {
			filDArianne: [{ url: 'actualite', label: 'Actualités', guarded: true }],
		},
	},
	{
		path: 'contacts',
		component: ExternalFileComponent,
		data: {
			filDArianne: [{ url: 'contacts', label: 'Contacts', guarded: true }],
		}
	},
	{
		path: 'ressources/prise-besoin-videosurveillance',
		component: FormulaireProjetVideosurveillanceComponent,
		data: {
			filDArianne: [{ url: 'prise-besoin-videosurveillance', label: 'Formulaire de videosurveillance', guarded: true }],
		}
	},
	{
		path: 'videosurveillance-confirmation',
		component: VideosurveillanceConfirmationComponent,
		data: {
			filDarianne: [{ url: 'videosurveillance', label: 'Videosurveillance', guarded: true }],
		}
	},
	{
		path: 'ressources/hik-ax-pro',
		component: HikAxProComponent,
		data: {
			filDArianne: [{ url: 'hik-ax-pro', label: 'HIKVISION AX PRO', guarded: true }],
		}
	},
	{
		path: 'ressources/:res',
		component: ExternalFileComponent,
		data: {
			filDArianne: [{ url: 'ressources', label: 'Ressources', guarded: true }],
		},
	},
	{
		path: 'ressources',
		component: RessourcesComponent,
		data: {
			filDArianne: [{ url: 'ressources', label: 'Ressources', guarded: true }],
		},
	},
	{
		path: 'outils',
		component: OutilsComponent,
		data: {
			filDArianne: [{ url: 'outils', label: 'Outils', guarded: true }],
		},
	},
	{
		path: 'frais-de-livraison',
		canActivate: [AuthGuard],
		component: GrilleTransportComponent,
		data: {
			filDArianne: [{ url: 'frais-de-livraison', label: 'Frais de livraison', guarded: true }],
		},
	},
	{
		path: 'panier',
		loadChildren: () =>
		import('./panier/panier.module').then(
			(mod) => mod.PanierModule
			),
		},
	{
		path: 'echec-reglement',
		component: EchecReglementComponent,
		canActivate: [AuthGuard],
		data: {
			filDArianne: [{ url: 'echec-reglement', label: 'Echec de règlement', guarded: true }]
		},
	},
	{
		path: 'conditions-generales-de-vente',
		component: ConditionsGeneralesDeVenteComponent,
		data: {
			filDArianne: [
				{
					url: 'conditions-generales-de-vente',
					label: 'Conditions générales de vente',
				},
			],
		},
	},
	{
		path: 'conditions-sav',
		component: ConditionsSavComponent,
		data: {
			filDArianne: [{ url: 'conditions-sav', label: 'Conditions SAV', guarded: true }],
		},
	},
	{
		path: 'obj-display',
		component: ObjDisplayComponent,
		data: {
			filDArianne: [{ url: 'obj-display', label: 'Affichage d\'objet', guarded: true }],
		},
	},

	{
		path: '404',
		component: PageNotFoundComponent,
		data: {
			filDArianne: [{ url: '404', label: 'Page non trouvée', guarded: true }],
		},
	},
	{
		path: 'licences-cybersecurite',
		loadChildren: () =>
		import('@/systeme-aide-choix/systeme-aide-choix.module').then((mod) => mod.SystemeAideChoixModule)
	},
	{
		path: 'focus/:target',
		component: FocusComponent,
		data: {
			focus: [
				{ target: ':target' }
			]
		}
	},
	{
		path: 'configurateur',
		canActivate: [AuthGuard],
		loadChildren: () =>
		import('@/configurateurs/configurateurs.module').then((mod) => mod.ConfigurateursModule),
	},
	{
		path: 'espace-client',
		loadChildren: () =>
		import('./espace-client/espace-client.module').then(
			(mod) => mod.EspaceClientModule
			),
		},
		{
			path: '',
			component: AccueilComponent
		},
		{
		path: '**', component: PageNotFoundComponent,
		data: {
			filDArianne: [{ url: '404', label: 'Page non trouvée', guarded: true }],
		},
	}
];




@NgModule({
	imports: [

	],
	exports: [RouterModule],

	//providers: [{ provide: UrlHandlingStrategy, useClass: CustomUrlHandlingStrategy }],
})
export class AppRoutingModule { }
