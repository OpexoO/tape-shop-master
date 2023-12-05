const couponType = {
  Flat: 'flat',
  Percentage: 'percentage',
} as const;

export const couponChoose = {
  All: 'all',
  Custom: 'custom',
} as const;

export default couponType;
