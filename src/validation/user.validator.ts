import { PASSWORD_MESSAGE } from '@/constants/messages';
import { PASSWORD_REGEX } from '@/constants/regex';
import { isValidEmail, isValidString } from '@/utils/validTypes';

export default class UserValidator {
  private readonly body: any;
  private readonly nameLength: number = 2;

  constructor(body: any = {}) {
    this.body = body;
  }

  public isAllValid(): string | boolean {
    const allValidations = [this.isValidName, this.isValidEmail, this.isValidPassword];
    for (let i = 0; i < allValidations.length; i += 1) {
      const result = allValidations[i].call(this);
      if (typeof result === 'string') {
        return result;
      }
    }
    return true;
  }

  public isValidName(name?: string): boolean | string {
    const value = name || this.body.name;
    if (!isValidString(value) || value.length < this.nameLength) {
      return `Name should be minimum ${this.nameLength} characters`;
    }
    return true;
  }

  public isValidPassword(password?: string): boolean | string {
    const value = password || this.body.password;
    if (!PASSWORD_REGEX.test(value)) {
      return PASSWORD_MESSAGE;
    }
    return true;
  }

  public isValidEmail(email?: string): boolean | string {
    const value = email || this.body.email;
    if (!isValidEmail(value)) {
      return 'Provide valid email';
    }
    return true;
  }
}
