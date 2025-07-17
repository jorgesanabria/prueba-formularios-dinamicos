import { FormConfig, FormField, ValidationRule } from '@/types/formTypes';

export class FormValidator {
  private config: FormConfig;

  constructor(config: FormConfig) {
    this.config = config;
  }

  validateField(field: FormField, value: any, formData: any): string | null {
    if (!field.validation) return null;

    for (const rule of field.validation) {
      const error = this.validateRule(rule, value, formData);
      if (error) return error;
    }

    return null;
  }

  validateForm(fields: FormField[], formData: any): { [key: string]: string } {
    const errors: { [key: string]: string } = {};

    for (const field of fields) {
      const error = this.validateField(field, formData[field.id], formData);
      if (error) {
        errors[field.id] = error;
      }
    }

    return errors;
  }

  private validateRule(rule: ValidationRule, value: any, formData: any): string | null {
    switch (rule.type) {
      case 'required':
        if (value === undefined || value === null || value === '' || 
            (Array.isArray(value) && value.length === 0)) {
          return rule.message;
        }
        break;

      case 'email':
        if (value && !this.isValidEmail(value)) {
          return rule.message;
        }
        break;

      case 'min':
        if (value !== undefined && value !== null && value !== '') {
          if (typeof value === 'string' && value.length < rule.value) {
            return rule.message;
          }
          if (typeof value === 'number' && value < rule.value) {
            return rule.message;
          }
        }
        break;

      case 'max':
        if (value !== undefined && value !== null && value !== '') {
          if (typeof value === 'string' && value.length > rule.value) {
            return rule.message;
          }
          if (typeof value === 'number' && value > rule.value) {
            return rule.message;
          }
        }
        break;

      case 'pattern':
        if (value && rule.value instanceof RegExp && !rule.value.test(value)) {
          return rule.message;
        }
        break;

      case 'custom':
        if (rule.value && typeof rule.value === 'function') {
          const result = rule.value(value, formData);
          if (result !== true) {
            return typeof result === 'string' ? result : rule.message;
          }
        }
        break;

      default:
        break;
    }

    return null;
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}