import { PreparedContactFeedback } from '@/interfaces/contactFeedback';
import { isValidEmail, isValidString } from '@/utils/validTypes';

export default class ContactFeedbackValidator {
  private readonly body: PreparedContactFeedback;

  constructor(body: PreparedContactFeedback) {
    this.body = body || {};
  }

  public isAllValid(): string | boolean {
    const allValidations = [this.isValidName, this.isValidEmail, this.isValidMessage];
    for (let i = 0; i < allValidations.length; i += 1) {
      const result = allValidations[i].call(this);
      if (typeof result === 'string') {
        return result;
      }
    }
    return true;
  }

  public isValidName(name?: string): string | boolean {
    const value = name || this.body.name;
    if (!isValidString(value)) {
      return 'Provide your name';
    }
    return true;
  }

  public isValidEmail(email?: string): string | boolean {
    const value = email || this.body.email;
    if (!isValidEmail(value)) {
      return 'Provide valid email';
    }
    return true;
  }

  public isValidMessage(message?: string): string | boolean {
    const value = message || this.body.message;
    if (!isValidString(value)) {
      return 'Provide your message';
    }
    return true;
  }
}
