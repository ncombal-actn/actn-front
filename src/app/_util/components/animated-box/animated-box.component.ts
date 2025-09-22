import { Component, OnInit, Input } from '@angular/core';
import { environment } from '@env';
import { ComponentsInteractionService } from '@/_core/_services/components-interaction.service';

@Component({
	selector: 'app-animated-box',
	templateUrl: './animated-box.component.html',
	styleUrls: ['./animated-box.component.scss']
})
export class AnimatedBoxComponent implements OnInit
{
	public environment = environment;

	@Input() type:			string	= ""; // 'href' (default) || 'routerlink'
	@Input() linkUrl:		string	= null;
	@Input() imgUrl:		string	= "";
	@Input() loginBarrier:	boolean = false;

	@Input() titre:			string	= "Titre";
	@Input() libelle:		string	= "";//"LOREM IPSUM";
	@Input() description:	string	= ""; //"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer sit amet consequat justo. Proin vestibulum consequat eros ut faucibus. Aliquam erat volutpat. Integer ac nunc tortor. Nunc luctus venenatis velit, quis pulvinar ante varius vitae. Vivamus aliquet sit amet ante et dignissim. Vivamus vestibulum nisi sed dolor condimentum, eget lobortis leo egestas. Praesent nec nisl nec eros consectetur finibus. Maecenas porta congue ullamcorper. Nam a vehicula ex.";
	@Input() couleur:		string	= null;

	constructor(
		public componentsInteractionService: ComponentsInteractionService
	) { }

	ngOnInit(): void
	{
		if (this.couleur == null)
		{
			this.couleur = "#003264";
		}
		// console.log("type", this.type, " , linkUrl", this.linkUrl, " , imgUrl", this.imgUrl, " , titre", this.titre, " , libelle", this.libelle, " , description", this.description);
	}

}
