import { ConfigurateurService } from '@/configurateurs/configurateur.service';
import { Configuration } from '@/configurateurs/configuration.model';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { SauvegardeService } from '../sauvegarde.service';
import {faClipboardList, faCommentDots, faTrash} from "@fortawesome/free-solid-svg-icons";

@Component({
	selector: 'conf-chargement',
	templateUrl: './chargement.component.html',
	styleUrls: ['./chargement.component.scss']
})
export class ChargementComponent implements OnInit {

	@Input() show = false;
	@Output() showChange = new EventEmitter<boolean>();

	marque = 'none';

	configurations$: Observable<Configuration[]>;

	produitsCompris(configuration: Configuration): string {
		const ret = configuration.getProductListWithQuantities().filter(pq => pq.qte > 0).map(pq => `${pq.produit} x ${pq.qte}`).join('\r\n');
		return ret;
	}

	constructor(
		protected sauvegardeService: SauvegardeService,
		protected configService: ConfigurateurService,
		protected router: Router
	) { }

	ngOnInit(): void {
		this.configurations$ = this.sauvegardeService.configurations$;
	}

	onSelect(configuration: Configuration): void {
		this.configService.pendingProducts = Array.from(configuration.configuration).map(e => e[1]).reduce((acc, val) => acc = acc.concat(Array.from(val).map(e => e[1]).reduce((acc, val) => acc = acc.concat(val), [])), []);
		this.configService.pendingName = configuration.name;
		this.configService.pendingCommentaires = configuration.commentaires;
		const m = this.configService.modeles.find(modele => modele.produit === configuration.modele);
		this.router.navigate(['configurateur', this.marque, 'gammes', m.crits['Gamme'].value, 'modeles', m.produit, 'options']);
	}

	onClose(): void {
		this.show = false;
		this.showChange.emit(this.show);
	}

	onDelete(e: MouseEvent, configuration: Configuration): void {
		e.stopImmediatePropagation();
		this.sauvegardeService.delete(configuration);
	}

  protected readonly faClipboardList = faClipboardList;
  protected readonly faCommentDots = faCommentDots;
  protected readonly faTrash = faTrash;
}
