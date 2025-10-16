import { Component, OnInit, Input } from '@angular/core';
import { Clipboard } from '@angular/cdk/clipboard';
import {faFacebookSquare, faTwitterSquare} from "@fortawesome/free-brands-svg-icons";
import {faEnvelope} from "@fortawesome/free-solid-svg-icons";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatIcon} from "@angular/material/icon";
import {MatInput} from "@angular/material/input";
import {MatButton} from "@angular/material/button";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {NgClass} from "@angular/common";
import {TooltipComponent} from "@/_util/components/tooltip/tooltip.component";

@Component({
  selector: 'app-share',
  standalone: true,
  templateUrl: './share.component.html',
  imports: [
    MatFormField,
    MatLabel,
    MatIcon,
    MatInput,
    MatButton,
    FaIconComponent,
    NgClass,
    TooltipComponent
  ],
  styleUrls: ['./share.component.scss']
})
export class ShareComponent implements OnInit {

    @Input() title = 'Partager';
    @Input() textToClipboard = '';

    get encodedTextToClipboard(): string {
        return this.fixedEncodeURI(this.textToClipboard);
    }

    showPopup = false;

    constructor(private clipboard: Clipboard) { }

    ngOnInit(): void { }

    public copyToClipboard(): void {
        const success = this.clipboard.copy(this.encodedTextToClipboard);
        if (!success) {
            const pending = this.clipboard.beginCopy(this.encodedTextToClipboard);
            let remainingAttempts = 3;
            const attempt = () => {
                const result = pending.copy();
                if (!result && --remainingAttempts) {
                  attempt();
                } else {
                    pending.destroy();
                }
            };
            attempt();
        }
    }

    private fixedEncodeURI(str: string): string {
        return encodeURI(decodeURI(str)).replace(/[!'()*]/g, (c) => {
            return '%' + c.charCodeAt(0).toString(16);
        });
    }

    public twitterURI(str: string): string {
        return str.replace(/[#]/g, (c) => {
            return '%' + c.charCodeAt(0).toString(16);
        });
    }

  protected readonly faFacebookSquare = faFacebookSquare;
  protected readonly faEnvelope = faEnvelope;
  protected readonly faTwitterSquare = faTwitterSquare;
}
