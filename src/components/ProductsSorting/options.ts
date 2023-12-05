/* eslint-disable no-unused-vars */
export const enum SortingOptions {
  Price = 'price',
  PriceDesc = 'price-desc',
  Rating = 'rating',
  Popularity = 'popularity',
  Date = 'date',
}

export interface Option {
  value: SortingOptions;
  label: string;
}

export const options: Option[] = [
  { value: SortingOptions.Price, label: 'Sort by price: low to high' },
  { value: SortingOptions.PriceDesc, label: 'Sort by price: high to low' },
  { value: SortingOptions.Rating, label: 'Sort by average rating' },
  // { value: SortingOptions.Popularity, label: 'Sort by popularity' },
  { value: SortingOptions.Date, label: 'Sort by latest' },
];

export const DEFAULT_OPTION = options[0];
