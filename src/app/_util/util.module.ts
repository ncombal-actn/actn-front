import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InfiniteScrollModule } from "ngx-infinite-scroll";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from './material/material.module';
import { YouTubePlayerModule } from '@angular/youtube-player';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import {MatTableModule} from '@angular/material/table';
import {MatNativeDateModule} from '@angular/material/core';


import {
	faCopy,
	faBars,
	faCartPlus,
	faShoppingCart,
	faUser,
	faSearch,
	faCogs,
	faUsersCog,
	faCloud,
	faMoneyCheck,
	faUndo,
	faFileInvoice,
	faWrench,
	faNewspaper,
	faFilePdf,
	faTruck,
	faReceipt,
	faPhone,
	faArrowRight,
	faCaretDown,
	faBalanceScaleLeft,
	faChevronRight,
	faChevronUp,
	faChevronDown,
	faThList,
	faThLarge,
	faArrowLeft,
	faSignOutAlt,
	faKey,
	faHome,
	faQuestionCircle,
	faPlusCircle,
	faMinusCircle,
	faExclamationTriangle,
	faTimesCircle,
	faCalendarAlt,
	faTimes,
	faSave,
	faTag,
	faHistory,
	faShareAlt,
	faEnvelope,
	faClipboard,
	faHeart,
	faBookmark,
	faBell,
	faBellSlash,
	faStar,
	faPenSquare,
	faCheckCircle,
	faSlidersH,
	faRedoAlt,
	faTrash,
	faPen,
	faCheck,
	faPaperPlane,
	faChartLine,
	//faProjectDiagram,
	faPlayCircle,
	faPlus,
	faMinus,
	faInfoCircle,
	//faDollarSign,
	//faCalculator,
	faEuroSign,
	faUpload,
	faCommentDots,
	faClipboardList,
	faCalendar,
	faClone,
	faHeadset,
//	faIdCard,
	faUserTie,
	faBarcode,
//	faTicketAlt,
	faCircle,
	faChartPie,
	faTable,
	faPhoneVolume,
	faFileLines,
} from '@fortawesome/free-solid-svg-icons';
import {
	faHeart as farHeart,
	faBookmark as farBookmark,
	faStar as farStar,
	faQuestionCircle as farQuestionCircle,
	faTimesCircle as farTimesCircle
} from '@fortawesome/free-regular-svg-icons';
import {MatDialogModule} from '@angular/material/dialog';
import {
	faFacebookSquare,
	faTwitterSquare
} from '@fortawesome/free-brands-svg-icons';
import {MatCardModule} from '@angular/material/card';
import { ToggleClassOnDirective } from './directives/toggle-class-on.directive';
import { ExposeHeightSetterDirective } from './directives/expose-height-setter.directive';
import { IconButtonComponent } from './components/icon-button/icon-button.component';
import { ProduitsComponent } from './components/produits/produits.component';
import { AddToCartFormComponent } from './components/add-to-cart-form/add-to-cart-form.component';
import { ProduitPreviewComponent } from './components/produit-preview/produit-preview.component';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { PasswordShowInputComponent } from './components/password-show-input/password-show-input.component';
import { PopupObjDisplayComponent } from './components/popup-obj-display/popup-obj-display.component';
import { CotationRowComponent } from './components/cotation-row/cotation-row.component';

import { RouterModule } from '@angular/router';

import { ImgFallbackDirective } from './directives/img-fallback.directive';
import { AddClassOnChangeDirective } from './directives/add-class-on-change.directive';
import { SlidingListeComponent } from './components/sliding-liste/sliding-liste.component';
import { SlidingListFromLinkComponent } from './components/sliding-list-from-link/sliding-list-from-link.component';
import { TitleWLineComponent } from './components/title-w-line/title-w-line.component';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { CategorieComponent } from '@/catalogue/categorie/categorie.component';
import { YoutubeComponent, SafePipe } from './components/youtube/youtube.component';
import { TabSortComponent } from './components/tab-sort/tab-sort.component';
import { TooltipComponent } from './components/tooltip/tooltip.component';
import { PdfIconComponent } from './components/pdf-icon/pdf-icon.component';
import { InputNumberComponent } from './components/input-number/input-number.component';
import { GrilleTransportComponent } from './components/grille-transport/grille-transport.component';
import { ChangeAdresseComponent } from './components/change-adresse/change-adresse.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { EnduserFormComponent } from './components/enduser-form/enduser-form.component';
import { IFrameComponent } from './components/i-frame/i-frame.component';
import { PaniersEnregistresComponent } from '@/espace-client/paniers-enregistres/paniers-enregistres.component';
import { StylePaginatorDirective } from './directives/style-paginator.directive';
import { SnackbarComponent } from './components/snackbar/snackbar.component';
import { BanniereComponent } from '@/banniere/banniere.component';
import { ShareComponent } from './components/share/share.component';
import { FavorisButtonComponent } from './components/favoris-button/favoris-button.component';
import { ComparateurButtonComponent } from './components/comparateur-button/comparateur-button.component';
import { ChipsListComponent } from './components/chips-list/chips-list.component';
import { FormationFormComponent } from './components/formation-form/formation-form.component';
import { AnimatedBoxComponent } from './components/animated-box/animated-box.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { ZerosPipe } from '@core/_pipes/zero.pipe';
import { DateTransformPipe } from '@core/_pipes/date-transform.pipe';
import {MatSortModule} from "@angular/material/sort";
import { OuiNonAdminPipe } from '@core/_pipes/ouiNonAdmin.pipe';
import { SecondesVersMinutesPipe } from '@core/_pipes/seconde-to-minutes.pipe';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { RemoveLineBreaksPipe } from '@core/_pipes/remove-line-breaks.pipe';
import { TypeofPipe } from '@core/_pipes/typeof.pipe';
import { StopPropagationDirective } from './directives/stop-propagation.directive';
import { MatFormFieldModule } from '@angular/material/form-field';
import {  MatStepperModule } from '@angular/material/stepper';
import {  MatBadgeModule } from '@angular/material/badge';
import { HorizonDelaisComponent ,DialogContentComponent} from './components/horizon-delais/horizon-delais.component';
/**
 * Module partagé, à importer partout où l'un de ses éléments est nécessaire.
 */
@NgModule({

	declarations: [
		StylePaginatorDirective,
		ToggleClassOnDirective,
		ExposeHeightSetterDirective,
		IconButtonComponent,
		ProduitsComponent,
		AddToCartFormComponent,
		//CatalogueSearchBarComponent,
		ProduitPreviewComponent,
		LoginFormComponent,
		ImgFallbackDirective,
		AddClassOnChangeDirective,
		PasswordShowInputComponent,
		SlidingListeComponent,
		SlidingListFromLinkComponent,
		TitleWLineComponent,
		SpinnerComponent,
		CategorieComponent,
		YoutubeComponent,
		TabSortComponent,
		TooltipComponent,
		PdfIconComponent,
		InputNumberComponent,
		SafePipe,
		EnduserFormComponent,
		GrilleTransportComponent,
		ChangeAdresseComponent,
		IFrameComponent,
		PopupObjDisplayComponent,
		CotationRowComponent,
		PaniersEnregistresComponent,
		SnackbarComponent,
		BanniereComponent,
		ShareComponent,
		FavorisButtonComponent,
		ComparateurButtonComponent,
		ChipsListComponent,
		FormationFormComponent,
		AnimatedBoxComponent,
		ZerosPipe,
		DateTransformPipe,
		OuiNonAdminPipe,
		SecondesVersMinutesPipe,
		RemoveLineBreaksPipe,
		TypeofPipe,
		StopPropagationDirective,
  		HorizonDelaisComponent,
		  DialogContentComponent
	],

	imports: [
		MatToolbarModule,
		MatSidenavModule,
		MatExpansionModule,
		CommonModule,
		RouterModule,
		InfiniteScrollModule,
		FormsModule,
		ReactiveFormsModule,
		MaterialModule,
		FontAwesomeModule,
		YouTubePlayerModule,
		ClipboardModule,
		MatTableModule,
		MatSortModule,
		MatDatepickerModule,
		MatNativeDateModule,
		MatCardModule,
		MatFormFieldModule,	
		MatDialogModule,
		MatStepperModule,
    	MatBadgeModule,
	],


	exports: [
		CommonModule,
		RouterModule,
		MatDatepickerModule,
		MatNativeDateModule,
		MatCardModule,
		MatDialogModule,
	//	InfiniteScrollModule, j'ai fait le tour de a EEE NTM
		FormsModule,
		MatTableModule,
		MatSortModule,
		ReactiveFormsModule,
		MaterialModule,
		FontAwesomeModule,
		HorizonDelaisComponent,
		RemoveLineBreaksPipe,
		StylePaginatorDirective,
		ToggleClassOnDirective,
		ExposeHeightSetterDirective,
		ImgFallbackDirective,
		IconButtonComponent,
		ProduitsComponent,
		AddToCartFormComponent,
		//CatalogueSearchBarComponent,
		ProduitPreviewComponent,
		LoginFormComponent,
		PasswordShowInputComponent,
		SlidingListeComponent,
		SlidingListFromLinkComponent,
		TitleWLineComponent,
		CategorieComponent,
		SpinnerComponent,
		AddClassOnChangeDirective,
		DialogContentComponent,
		YoutubeComponent,
		TabSortComponent,
		TooltipComponent,
		PdfIconComponent,
		InputNumberComponent,
		SafePipe,
		EnduserFormComponent,
		ChangeAdresseComponent,
		PopupObjDisplayComponent,
		CotationRowComponent,

		PaniersEnregistresComponent,
		SnackbarComponent,
		BanniereComponent,
		ShareComponent,
		FavorisButtonComponent,
		ComparateurButtonComponent,
		ChipsListComponent,
		FormationFormComponent,
		AnimatedBoxComponent,
		MatToolbarModule,
		MatSidenavModule,
		MatExpansionModule,
		ZerosPipe,
		TypeofPipe,
		DateTransformPipe,
		OuiNonAdminPipe,
		SecondesVersMinutesPipe,
		StopPropagationDirective,
		MatStepperModule,
    	MatBadgeModule

	]
})
export class UtilModule {
	constructor() {
		// Add an icon to the library for convenient access in other components
		// Permet d'appeler ces icons fontawesome dans les fichiers HTML.
		// Supprimer les icones non nécessaires avant mise en production.

		library.add(faPhoneVolume);
		library.add(faCopy);
		library.add(faBars);
		library.add(faHeart);
		library.add(farHeart);
		library.add(faBookmark);
		library.add(farBookmark);
		library.add(faCartPlus);
		library.add(faShoppingCart);
		library.add(faUser);
		library.add(faSearch);
		library.add(faCogs);
		library.add(faUsersCog);
		library.add(faCloud);
		library.add(faMoneyCheck);
		library.add(faUndo);
		library.add(faFileInvoice);
		library.add(faWrench);
		library.add(faNewspaper);
		library.add(faFilePdf);
		library.add(faTruck);
		library.add(faReceipt);
		library.add(faPhone);
		library.add(faArrowRight);
		library.add(faArrowLeft);
		library.add(faCaretDown);
		library.add(faBalanceScaleLeft);
		library.add(faChevronRight);
		library.add(faChevronUp);
		library.add(faChevronDown);
		library.add(faThList);
		library.add(faThLarge);
		library.add(faSignOutAlt);
		library.add(faKey);
		library.add(faFileLines);
		library.add(faHome);
		library.add(faQuestionCircle);
		library.add(farQuestionCircle);
		library.add(faPlusCircle);
		library.add(faMinusCircle);
		library.add(faExclamationTriangle);
		library.add(faTimesCircle);
		library.add(faCalendarAlt);
		library.add(faTimes);
		library.add(faSave);
		library.add(faTag);
		library.add(faHistory);
		library.add(faShareAlt);
		library.add(faFacebookSquare);
		library.add(faTwitterSquare);
		library.add(faEnvelope);
		library.add(faClipboard);
		library.add(faBell);
		library.add(faBellSlash);
		library.add(faStar);
		library.add(faPenSquare);
		library.add(faCheckCircle);
		library.add(faSlidersH);
		library.add(farStar);
		library.add(faRedoAlt);
		library.add(faTrash);
		library.add(faPen); // je me suis arrater de faire le trie ici je suis partis d'en bas
		library.add(faCheck);
		library.add(faPaperPlane);
		library.add(faPlayCircle);
		library.add(farTimesCircle);
		library.add(faChartLine);
		//library.add(faProjectDiagram);
		library.add(faPlus);
		library.add(faMinus);
		library.add(faInfoCircle);
		//library.add(faDollarSign);
		//library.add(faCalculator);
		library.add(faEuroSign);
		library.add(faUpload);
		library.add(faCommentDots);
		library.add(faClipboardList);
		library.add(faCalendar);
		library.add(faClone);
		library.add(faHeadset);
		//library.add(faIdCard);
		library.add(faUserTie);
		library.add(faBarcode);
		//library.add(faTicketAlt);
		library.add(faCircle);
		library.add(faChartPie);
		library.add(faTable);



	}
}
