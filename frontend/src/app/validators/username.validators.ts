import { AbstractControl, ValidationErrors, FormGroup } from '@angular/forms';

export class UsernameValidators {

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

    static shouldBeUnique(control: AbstractControl): Promise<ValidationErrors | null> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (control.value === 'skylab') {
                    resolve({ shouldBeUnique: true });
                } else {
                    resolve(null);
                }
            }, 2000);
        });
    }

    static isEmail(control: AbstractControl): ValidationErrors | null {
        const email = (control.value as string);
        if (email) {
            const emailSplit1 = email.split('@');
            if (emailSplit1[0] && emailSplit1[1]) {
                const username = emailSplit1[0];
                const mailService = emailSplit1[1];

                const emailSplit2 = mailService.split('.');
                if (emailSplit2[0] && emailSplit2[1]) {
                    return null;
                }
            }
        }
        return { isEmail: 'Invalid Email' };
    }

    static isName(control: AbstractControl): ValidationErrors | null {
        const name = (control.value as string);

        const numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
        let hasNumber = false;
        for (const n of numbers) {
            if (name.includes(n)) {
                hasNumber = true;
            }
        }

        if (hasNumber) {
            return { isName: 'Name cannot contain numbers!' };
        }
        return null;
    }

    static isCompanyEmail(control: AbstractControl): ValidationErrors | null {
        const mailExceptions = [
            'yahoo',
            'gmail',
            'outlook',
            'hotmail'
        ];

        const email = (control.value as string);
        if (email) {
            const emailSplit1 = email.split('@');
            if (emailSplit1[0] && emailSplit1[1]) {
                const username = emailSplit1[0];
                const mailService = emailSplit1[1];

                const emailSplit2 = mailService.split('.');
                if (emailSplit2[0] && emailSplit2[1]) {
                    if (mailExceptions.includes(emailSplit2[0])) {
                        return { isCompanyEmail: 'Not Company Email' };
                    }
                    return null;
                }
            }
        }
        return { isCompanyEmail: 'Invalid Email' };
    }

    static ifEmailThenPassword(control: AbstractControl): ValidationErrors | null {
        const email = (control as FormGroup).get('email').value;
        const password = (control as FormGroup).get('password').value;

        if (email) {
            let emailOK = false;
            const emailSplit1 = email.split('@');
            if (emailSplit1[0] && emailSplit1[1]) {
                const username = emailSplit1[0];
                const mailService = emailSplit1[1];

                const emailSplit2 = mailService.split('.');
                if (emailSplit2[0] && emailSplit2[1]) {
                    emailOK = true;
                }
            }

            if (!emailOK) {
                return { ifEmailThenPassword: 'Invalid Email' };
            }

            if (password) {
                if (password.length < 5) {
                    return { ifEmailThenPassword: 'Password must be at least 5 characters long!' };
                }
                const numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
                let hasNumber = false;

                for (const n of numbers) {
                    if (password.includes(n)) {
                        hasNumber = true;
                    }
                }
                if (!hasNumber) {
                    return { ifEmailThenPassword: 'Password must contain a number!' };
                }
                if (password.length > 0 && (password.toUpperCase() === password || password.toLowerCase() === password)) {
                    return { ifEmailThenPassword: 'Password must contain both uppercase and lowercase letters!' };
                }
                return null;
            } else {
                return { ifEmailThenPassword: 'If you entered an email you must also enter a password.' };
            }
        } else if (password) {
            return { ifEmailThenPassword: 'You cannot enter a password before entering an email.' };
        }
        return null;
    }
}
