export interface ProductOption {
  width: string;
  role: string;
  price: number;
}

export function getOptionPrice(options: ProductOption[], selected: string): number | undefined {
  return options.find((o: ProductOption) => selected === `${o.width};${o.role}`)?.price;
}

export function isValidOption(obj: any): obj is ProductOption {
  return (!!obj?.width && !!obj?.price && !!obj?.role)
    && typeof obj?.width === 'string'
    && typeof obj?.role === 'string'
    && typeof obj?.price === 'number';
}
