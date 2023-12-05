interface IsBase64Options {
  allowEmpty?: boolean | undefined;
  allowMime?: boolean | undefined;
  mimeRequired?: boolean | undefined;
  paddingRequired?: boolean | undefined;
}

const isBase64 = (value: string, opts?: IsBase64Options): boolean => {
  let options = opts;
  if (!(options instanceof Object)) {
    options = {};
  }

  if (options.allowEmpty === false && value === '') {
    return false;
  }

  const mimeRegex: string = '(data:\\w+\\/[a-zA-Z\\+\\-\\.]+;base64,)';
  let regex: string = '(?:[A-Za-z0-9+\\/]{4})*(?:[A-Za-z0-9+\\/]{2}==|[A-Za-z0-9+\\/]{3}=)?';

  if (options.mimeRequired) {
    regex = mimeRegex + regex;
  } else if (options.allowMime) {
    regex = `${mimeRegex}?${regex}`;
  }

  if (options.paddingRequired === false) {
    regex = '(?:[A-Za-z0-9+\\/]{4})*(?:[A-Za-z0-9+\\/]{2}(==)?|[A-Za-z0-9+\\/]{3}=?)?';
  }

  return new RegExp(`^${regex}$`, 'gi').test(value);
};
export default isBase64;
