import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';


export function emailWithTLDValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    
    if (!value) {
      return null;
    }
    
    // Regular expression for email with valid TLD
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    
    const isValid = emailPattern.test(value);
    
    return isValid ? null : { invalidEmailFormat: true };
  };
}