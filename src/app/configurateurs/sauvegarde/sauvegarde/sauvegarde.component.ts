import { ConfigurateurService } from '@/configurateurs/configurateur.service';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SauvegardeService } from '../sauvegarde.service'

@Component({
  selector: 'conf-sauvegarde',
  standalone: true,
  templateUrl: './sauvegarde.component.html',
  styleUrls: ['./sauvegarde.component.scss']
})
export class SauvegardeComponent implements OnInit {

	@Input()  public show = false;
	@Output() public showChange = new EventEmitter<boolean>();

	form: FormGroup;

	constructor(
		protected fb: FormBuilder,
		protected saveService: SauvegardeService,
		protected configService: ConfigurateurService
	) { }

	ngOnInit(): void {
		this.form = this.fb.group({
			nom: ['', [Validators.required]],
			commentaires: ['', []]
		});
	}

	/**
	 * Ferme la fenêtre de sauvegarde.
	 */
	onClose(): void {
		this.show = false;
		this.showChange.emit(this.show);
	}

	/**
	 * Sauvegarde la configuration en cours et ferme la fenêtre de sauvegarde.
	 */
	onSave(): void {
		this.configService.configuration.name = this.form.get('nom').value;
		this.configService.configuration.commentaires = this.form.get('commentaires').value;
		this.form.get('nom').setValue('');
		this.form.get('commentaires').setValue('');
		this.saveService.add(this.configService.configuration);
		this.onClose();
	}

}
