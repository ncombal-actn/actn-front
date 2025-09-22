import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Injectable({
    providedIn: 'root'
})
export class TitleService {

    constructor(
        private title: Title
    ) { }

    public resetTitle(): void {
        this.title.setTitle('ACTN - Votre Distributeur IT');
    }

    public setTitle(title: string): void {
        this.title.setTitle('ACTN - Votre Distributeur IT' + ' - ' + title);
    }

    public addTitle(title: string): void {
        this.title.setTitle(this.title.getTitle() + ' - ' + title);
    }
}
