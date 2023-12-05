import { isBrowser, isNode } from '@/utils/helpers';

interface Encrypted {
  cipherText: string;
  iv: string;
}

export default class EncryptionService {
  private key: string = '';
  private crypto: Crypto | null = null;
  private readonly text: string;
  private readonly algorithm = 'AES-GCM';

  constructor(text: string) {
    this.text = text;
    this.initProcessRelatedVars();
  }

  public async encrypt(): Promise<Encrypted> {
    if (!this.crypto) {
      throw new Error('Crypto API is not available');
    }
    if (!this.text) {
      throw new Error('Provide valid text');
    }

    const iv = this.crypto.getRandomValues(new Uint8Array(12));
    const plainText = new TextEncoder().encode(this.text);
    const password = await this.crypto.subtle.digest('SHA-256', new TextEncoder().encode(this.key));
    const secretKey = await this.crypto.subtle.importKey(
      'raw',
      password,
      this.algorithm,
      true,
      ['encrypt', 'decrypt'],
    );
    const cipherText = await this.crypto.subtle.encrypt({
      name: this.algorithm,
      iv,
    }, secretKey, plainText);

    return ({
      cipherText: Buffer.from(cipherText).toString('base64'),
      iv: Buffer.from(iv).toString('base64'),
    });
  }

  public async decrypt(text: string, iv: string): Promise<string> {
    if (!this.crypto) {
      throw new Error('Crypto API is not available');
    }
    if (!text) return text;

    const password = await this.crypto.subtle.digest('SHA-256', new TextEncoder().encode(this.key));
    const secretKey = await this.crypto.subtle.importKey(
      'raw',
      password,
      this.algorithm,
      true,
      ['encrypt', 'decrypt'],
    );

    const clearText = await this.crypto.subtle.decrypt({
      name: this.algorithm,
      iv: Buffer.from(iv, 'base64'),
    }, secretKey, Buffer.from(text, 'base64'));
    return new TextDecoder().decode(clearText);
  }

  private initProcessRelatedVars() {
    if (isBrowser()) {
      this.key = process.env.NEXT_PUBLIC_SECRET_KEY || '';
      this.crypto = window.crypto;
    } else if (isNode()) {
      this.key = process.env.SECRET_KEY || '';
      this.crypto = globalThis.crypto;
    }
  }
}
