export const cartActions = {
  Add: 'add',
  Remove: 'remove',
  RemoveAll: 'removeAll',
  Coupon: 'coupon',
  Shipping: 'shipping',
  Merge: 'merge',
  Other: 'other',
} as const;

export type CartActionsType = (typeof cartActions)[keyof typeof cartActions]
