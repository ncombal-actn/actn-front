import { FormGroup } from '@angular/forms';

/**
 * Vérifie si deux champs d'un formulaire sont égaux.
 * @param controlName Nom du premier champ
 * @param confirmedControlName Nom du deuxième champ
 */
export function ConfirmedValidator(controlName: string, confirmedControlName: string) {
    return (formGroup: FormGroup) => {
        const control = formGroup.controls[controlName];
        const confirmedControl = formGroup.controls[confirmedControlName];
        if (confirmedControl.errors && !confirmedControl.errors.confirmedValidator) {
            return;
        }
        if (control.value !== confirmedControl.value) {
            confirmedControl.setErrors({ confirmedValidator: true });
        } else {
            confirmedControl.setErrors(null);
        }
    }
}
