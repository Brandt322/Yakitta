import { AbstractControl, ValidatorFn } from '@angular/forms';

export class CustomValidators {

  static required(control: AbstractControl) {
    const value = control.value;
    if (value == null || value.length === 0) {
      return { 'required': true };
    }
    return null;
  }

  static notNullValidator(control: AbstractControl) {
    const isNull = (control.value === null || control.value === 'null');
    return isNull ? { 'null': true } : null;
  }

  static minLength(min: number): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value = control.value;
      if (value != null && value.length < min) {
        return { 'minLength': { min } };
      }
      return null;
    };
  }

  static fileSizeValidator(maxSize: number): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const file = control.value;
      if (file instanceof File && file.size > maxSize) {
        return { 'fileSize': { maxSize } };
      }
      return null;
    };
  }

  static maxLength(max: number): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value = control.value;
      if (value != null && value.length > max) {
        return { 'maxLength': { max } };
      }
      return null;
    };
  }

  static dateGreaterThan(startDateField: string, endDateField: string): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const startDate = control.get(startDateField)?.value;
      const endDate = control.get(endDateField)?.value;
      if (startDate != null && endDate != null && startDate > endDate) {
        return { 'dateGreaterThan': true };
      }
      return null;
    };
  }

  static amountGreaterThan(initialAmountField: string, finalAmountField: string): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const initialAmount = control.get(initialAmountField)?.value;
      const finalAmount = control.get(finalAmountField)?.value;
      if (initialAmount != null && finalAmount != null && Number(initialAmount) >= Number(finalAmount)) {
        return { 'amountGreaterThan': true };
      }
      return null;
    };
  }

  static emailValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value = control.value;
      const emailPattern = /^[a-zA-Z0-9._%+-ñÑ]+@[a-zA-Z0-9.-ñÑ]+\.[a-zA-Z]{2,}$/;
      if (value != null && !emailPattern.test(value)) {
        return { 'email': true };
      }
      return null;
    };
  }

  static stringType(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value = control.value;
      const stringPattern = /^[a-zA-Z áéíóúÁÉÍÓÚ]*$/;
      if (value != null && !stringPattern.test(value)) {
        return { 'stringType': true };
      }
      return null;
    };
  }

  static stringWithPunctuationValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value = control.value;
      const stringPattern = /^[a-zA-Z áéíóúÁÉÍÓÚ.,;:!?\\+]*$/;
      if (value != null && !stringPattern.test(value)) {
        return { 'stringWithPunctuation': true };
      }
      return null;
    };
  }

  static numericType(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value = control.value;
      const numericPattern = /^[0-9]*$/;
      if (value != null && !numericPattern.test(value)) {
        return { 'numericType': true };
      }
      return null;
    };
  }

  static minValue(min: number): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value = control.value;
      if (value != null && value < min) {
        return { 'minValue': { min } };
      }
      return null;
    };
  }

  static maxValue(max: number): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value = control.value;
      if (value != null && value > max) {
        return { 'maxValue': { max } };
      }
      return null;
    };
  }

  static linkedinUrl(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value = control.value;
      const linkedinPattern = /^(https?:\/\/)?([www.]+)?linkedin.com\/(in|pub)\/[a-zA-Z0-9_-]+(\/)?$/;
      if (value != null && !linkedinPattern.test(value)) {
        return { 'linkedinUrl': true };
      }
      return null;
    };
  }

  static githubUrl(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value = control.value;
      const githubPattern = /^(https?:\/\/)?(www.)?github.com\/[a-zA-Z0-9_-]+(\/)?$/;
      if (value != null && !githubPattern.test(value)) {
        return { 'githubUrl': true };
      }
      return null;
    };
  }
}
