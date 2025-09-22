// date-transform.pipe.ts

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateTransform'
})
export class DateTransformPipe implements PipeTransform {
  transform(value: string): Date | null {
    if (!value || value.length !== 8) {
      // Si la valeur est vide ou ne contient pas 8 chiffres, retournez null.
      return null;
    }

    // Analysez la chaîne pour extraire l'année, le mois et le jour.
    const year = +value.substr(0, 4);
    const month = +value.substr(4, 2);
    const day = +value.substr(6, 2);

    // Créez une nouvelle date à partir des valeurs extraites.
    const date = new Date(year, month - 1, day);

    // Vérifiez si la date est valide avant de la renvoyer.
    return isNaN(date.getTime()) ? null : date;
  }
}
