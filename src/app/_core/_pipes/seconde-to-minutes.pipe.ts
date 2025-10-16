import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  standalone: true,
  name: 'secondesToMinutes'
})
export class SecondesVersMinutesPipe implements PipeTransform {
  //Le pipe tranformer maintenant les minutes en heures

  transform(value: number): string {
    if (value == null || isNaN(value)) {
      return '';
    }
    const heures = Math.floor(value / 60);
    const minutes = value % 60;


    const affichageHeures = heures > 0 ? `${heures}h ` : '';
    const affichageMinutes = `${minutes}min `;


    return affichageHeures + affichageMinutes;
  }
}
