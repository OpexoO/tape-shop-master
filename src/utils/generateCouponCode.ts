import { randomElem } from './helpers';

interface IConfig {
  count: number;
  length: number;
  charset: string;
  uniqueCharset: string;
  prefix: string;
  postfix: string;
  pattern: string;
}

const PATTERN_CHAR = '#';

function generateCouponCode(conf: Partial<Config>, sequenceOffset: number = NaN): string[] {
  const config = new Config(conf);
  let offset: number = sequenceOffset;

  if (maxCombinationsCount(config) < config.count) {
    throw new Error('Not possible to generate requested number of codes.');
  }
  if (!Number.isNaN(offset)) {
    const max = maxCombinationsCount(config);
    if (offset < 0) {
      offset = 0;
    } else if (offset >= max) {
      offset = max - 1;
    }
  }

  const codes: string[] = [];
  const map = new Map<string, boolean>();
  let { count } = config;
  while (count > 0) {
    const code = generateOne(config, offset);
    if (!map.has(code)) {
      codes.push(code);
      map.set(code, true);
      count -= 1;
    }
    offset += 1;
  }
  return codes;
}

function charset(name: string): string {
  return ({
    numbers: '0123456789',
    alphabetic: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
    alphanumeric: '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
  })[name]!;
}

function maxCombinationsCount(config: Config) {
  return config.uniqueCharset.length ** config.length;
}

function generateOne(config: Config, sequenceOffset: number): string {
  let generateIndex: number = 0;
  const code = config.pattern.split('').map((c: string) => {
    if (c === PATTERN_CHAR) {
      const char = Number.isNaN(sequenceOffset)
        ? randomElem(config.charset)
        : sequenceElem(config, sequenceOffset, generateIndex);
      generateIndex += 1;
      return char;
    }
    return c;
  }).join('');
  return config.prefix + code + config.postfix;
}

function sequenceElem(config: Config, sequenceOffset: number, charIndex: number): string {
  return config.uniqueCharset[
    Math.floor(
      sequenceOffset / config.uniqueCharset.length ** (config.length - charIndex - 1),
    ) % config.uniqueCharset.length
  ];
}

function uniqueCharset(charset: string): string {
  const map = new Map<string, boolean>();
  const result = [];

  for (let i = 0; i < charset.length; i += 1) {
    const sign = charset[i];

    if (!map.has(sign)) {
      result.push(sign);
      map.set(sign, true);
    }
  }

  return result.join('');
}

function repeat(str: string, length: number): string {
  let res: string = '';
  for (let i = 0; i < length; i += 1) {
    res += str;
  }
  return res;
}

class Config implements IConfig {
  public count: number;
  public length: number;
  public charset: string;
  public uniqueCharset: string;
  public prefix: string;
  public postfix: string;
  public pattern: string;

  constructor(config: Partial<IConfig> = {}) {
    this.count = config.count || 1;
    this.length = config.length || 7;
    this.charset = config.charset || charset('alphanumeric');
    this.uniqueCharset = uniqueCharset(this.charset);
    this.prefix = config.prefix || '';
    this.postfix = config.postfix || '';
    this.pattern = config.pattern || repeat(PATTERN_CHAR, this.length);

    if (config.pattern) {
      this.length = (config.pattern.match(new RegExp(PATTERN_CHAR, 'g')) || []).length;
    }
  }
}

export default {
  generateCouponCode,
  charset,
};
