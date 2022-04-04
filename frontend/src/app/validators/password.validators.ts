import { AbstractControl, ValidationErrors, FormGroup } from '@angular/forms';


export class PasswordValidators {

    constructor() { }

    static minLength(control: AbstractControl): ValidationErrors | null {
        const len = (control.value as string).length;
        const returnable = {
            minLength: {
                requiredLength: 5,
                actualLength: len
            }
        };
        if (len < 5) {
            return returnable;
        }
        return null;
    }

    static strength(control: AbstractControl): ValidationErrors | null {
        const str = (control.value as string);

        if (str === '') {
            return null;
        }
        const numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
        let hasNumber = false;

        for (const n of numbers) {
            if (str.includes(n)) {
                hasNumber = true;
            }
        }
        if (!hasNumber) {
            return { strength: 'Password must contain a number!' };
        }
        if (str.length > 0 && (str.toUpperCase() === str || str.toLowerCase() === str)) {
            return { strength: 'Password must contain both uppercase and lowercase letters!' };
        }
        return null;
    }

    static checkConfirmNew(control: AbstractControl): ValidationErrors | null {
        const newPass1 = (control as FormGroup).get('oldPassword').value;
        const newPass2 = (control as FormGroup).get('newPassword').value;

        if (newPass1 && newPass2 && (newPass1 === newPass2)) {
            const error = { checkConfirmNew: 'New Password can\'t be the same as the old Password!' };
            return error;
        }
        return null;
    }

    static checkConfirm(control: AbstractControl): ValidationErrors | null {
        const newPass1 = (control as FormGroup).get('newPassword').value;
        const newPass2 = (control as FormGroup).get('confirmPassword').value;

        if (newPass1 && newPass2 && (newPass1 !== newPass2)) {
            const error = { checkConfirm: 'Passwords do not match!' };
            return error;
        }
        return null;
    }
}
