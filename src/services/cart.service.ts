/* eslint-disable no-unused-vars */
import {
  Cart, CartItem, NewServerCart, ServerCartItem, isCartItem, isServerCartItem,
} from '@/interfaces/cart';
import { Product, ProductItemPreview } from '@/interfaces/product/product';
import { formatPrice, roundPrice } from '@/utils/helpers';
import { AppliedCoupon } from '@/interfaces/coupon';
import couponType from '@/constants/coupon';
import { isValidNumber } from '@/utils/validTypes';
import { isShippingDestination } from '@/interfaces/shippingRates';
import CouponValidator from '@/validation/coupon.validator';
import { ProductOption, getOptionPrice } from '@/interfaces/product/productOption';
import ShippingService from './shipping.service';

export default class CartService {
  public static readonly initialCartState: Partial<Cart> = {
    userId: '',
    shippingDestination: null,
    totalAmount: 0,
    totalPrice: 0,
    items: [],
  };

  public static fromServer(obj: any): Cart {
    const mapItems = (o: any) => (!o.info ? null : {
      total: o.total,
      info: {
        _id: o.info._id.toString(),
        id: o.info._id.toString(),
        name: o.info.name,
        rate: Math.round(o.info.rate || 0),
        images: o.info.images,
        price: o.selectedOption ? getOptionPrice(o.info.options, o.selectedOption) : o.info.price,
        categories: (o.info.categories || []).map((o: any) => ({
          _id: o._id.toString(),
          id: o._id.toString(),
          name: o.name,
          imageUrl: o.imageUrl,
        })),
        dateAdded: o.info.dateAdded,
        availability: o.info.availability,
        selectedOption: o.selectedOption,
        weight: o.info.weight,
      },
    });

    return ({
      _id: obj._id.toString(),
      id: obj._id.toString(),
      userId: obj.userId.toString(),
      coupon: obj.coupon,
      shippingDestination: ShippingService.destinationFromServer(obj.shippingDestination),
      totalAmount: obj.totalAmount,
      totalPrice: obj.totalPrice,
      items: (obj.items || []).map(mapItems),
      appliedCouponPrice: obj.appliedCouponPrice || 0,
      lastUpdated: obj.lastUpdated,
    });
  }

  public static toServer(obj: any): NewServerCart {
    return ({
      userId: obj.userId,
      coupon: obj.coupon || null,
      shippingDestination: obj.shippingDestination || null,
      totalAmount: obj.totalAmount,
      totalPrice: obj.totalPrice,
      items: obj.items || [],
      appliedCouponPrice: obj.appliedCouponPrice || 0,
      lastUpdated: obj.lastUpdated,
      expiryDate: obj.expiryDate,
    });
  }

  public static validate(fields: NewServerCart): boolean | string {
    if (!isValidNumber(fields.totalAmount) || fields.totalAmount < 0) {
      return 'Provide non-negative number for total amount';
    }
    if (!isValidNumber(fields.totalPrice) || fields.totalPrice < 0) {
      return 'Provide non-negative number for total price';
    }
    if (fields.appliedCouponPrice
      && (!isValidNumber(fields.appliedCouponPrice) || fields.appliedCouponPrice < 0)) {
      return 'Provide non-negative number for coupon sale';
    }
    if (fields.coupon) {
      const couponValidator = new CouponValidator(fields.coupon);
      if (!couponValidator.isAllValid()) {
        return 'Provide valid coupon information';
      }
    }
    if (!Array.isArray(fields.items) || (fields.items.length && !fields.items.every(isServerCartItem))) {
      return 'Provide valid cart items';
    }
    if (fields.shippingDestination && !isShippingDestination(fields.shippingDestination)) {
      return 'Provide valid shipping destination';
    }
    return true;
  }

  public static mergeCarts(newCart: Cart, oldCart: Cart): Cart {
    let cart: Cart = {
      ...newCart,
      items: [...newCart.items],
    };
    oldCart.items.forEach((i: CartItem) => {
      cart = this.addItems(i, cart);
    });
    cart.coupon = oldCart.coupon || cart.coupon;
    cart.shippingDestination = oldCart.shippingDestination || cart.shippingDestination;
    return cart;
  }

  public static refresh(cart: Cart): Cart {
    let totalAmount: number = 0;
    let totalPrice: number = 0;
    const newItems = cart.items.filter((i: CartItem) => {
      if (!i?.info || !i?.total) return false;
      totalAmount += i.total;
      totalPrice = roundPrice(totalPrice + roundPrice(i.total * i.info.price));
      return true;
    });
    return {
      ...cart,
      totalAmount,
      totalPrice,
      items: newItems,
    };
  }

  public static addItems(item: CartItem, currentState: Cart): Cart {
    return {
      ...currentState,
      totalAmount: currentState.totalAmount + item.total,
      totalPrice: roundPrice(currentState.totalPrice + roundPrice(item.total * item.info.price)),
      items: this.addToCart(item, currentState.items),
    };
  }

  public static removeItem(item: ServerCartItem, currentState: Cart): Cart {
    const itm = currentState.items.find(
      (i: CartItem) => (item.selectedOption ? i.info.selectedOption === item.selectedOption : true)
        && i.info._id === item.info,
    );
    if (!itm) return currentState;
    return {
      ...currentState,
      totalAmount: currentState.totalAmount - 1,
      totalPrice: roundPrice(currentState.totalPrice - itm.info.price),
      items: this.removeFromCart(item, currentState.items),
    };
  }

  public static removeAllItem(item: ServerCartItem, currentState: Cart): Cart {
    const idx = currentState.items.findIndex(
      (i: CartItem) => (item.selectedOption ? item.selectedOption === i.info.selectedOption : true)
        && i.info._id === item.info,
    );
    if (idx === -1) return currentState;
    const itm = currentState.items[idx];
    return {
      ...currentState,
      totalAmount: currentState.totalAmount - itm.total,
      totalPrice: roundPrice(currentState.totalPrice - roundPrice(itm.total * itm.info.price)),
      items: currentState.items.filter((_, i: number) => i !== idx),
    };
  }

  public static prepareItem(product: Product, amount: number, option?: ProductOption): CartItem {
    const info: ProductItemPreview = {
      _id: product._id,
      id: product.id,
      name: product.name,
      rate: product.rate || 0,
      images: product.images,
      price: product.price,
      categories: product.categories,
      dateAdded: product.dateAdded,
      availability: product.availability,
      weight: product.weight,
      withOptions: !!product.options?.length,
    };
    if (option) {
      info.selectedOption = `${option.width};${option.role}`;
    }
    return {
      total: amount,
      info,
    };
  }

  public static applyCoupon(cart: Cart, coupon: AppliedCoupon): Cart | string {
    if (!cart || cart.totalAmount === 0) {
      return {
        ...cart,
        appliedCouponPrice: 0,
        coupon: null,
      };
    }

    const itemsToApplyCoupon = coupon.appliedProducts.length
      ? cart.items.filter((i: CartItem) => coupon.appliedProducts.includes(i.info._id))
      : [...cart.items];
    const oldSumOfAppliedProducts = itemsToApplyCoupon
      .reduce((acc: number, curr: CartItem) => acc + (curr.total * curr.info.price), 0);
    if (oldSumOfAppliedProducts < coupon.requiredCartTotal) {
      return `Required minimum total of cart for current coupon is $${formatPrice(coupon.requiredCartTotal)}`;
    }

    const sumWithDiscountOfAppliedProducts = itemsToApplyCoupon.reduce((acc: number, curr: CartItem) => {
      const newPrice = roundPrice(
        coupon.type === couponType.Flat
          ? curr.info.price - coupon.discount
          : curr.info.price * ((100 - coupon.discount) / 100),
      );
      return acc + (curr.total * newPrice);
    }, 0);
    const maximumDiscount = oldSumOfAppliedProducts - coupon.maximumDiscount;
    let maximumDiscountExceeded: boolean = false;
    if (coupon.maximumDiscount && sumWithDiscountOfAppliedProducts < maximumDiscount) {
      maximumDiscountExceeded = true;
    }

    // let newSumOfAppliedProducts: number = 0;
    // const newItems = cart.items.map((i: CartItem) => {
    //   if (itemsToApplyCoupon.find((v: CartItem) => v.info._id === i.info._id)) {
    //     const ratio = i.info.price / oldSumOfAppliedProducts;
    //     let newPrice: number = 0;
    //     if (coupon.type === couponType.Flat) {
    //       newPrice = i.info.price - (ratio * coupon.discount);
    //     } else if (maximumDiscountExceeded) {
    //       newPrice = i.info.price - (ratio * coupon.maximumDiscount);
    //     } else {
    //       newPrice = i.info.price * ((100 - coupon.discount) / 100);
    //     }
    //     newPrice = roundPrice(newPrice);
    //     newSumOfAppliedProducts += i.total * newPrice;
    //     return {
    //       ...i,
    //       info: {
    //         ...i.info,
    //         oldPrice: i.info.price,
    //         price: newPrice,
    //       },
    //     };
    //   }

    //   return { ...i };
    // });
    // console.log(oldSumOfAppliedProducts, newSumOfAppliedProducts, maximumDiscountExceeded);
    let appliedCouponPrice: number = 0;
    if (maximumDiscountExceeded) {
      appliedCouponPrice = coupon.maximumDiscount;
    } else if (coupon.type === couponType.Flat) {
      const numOfItems = itemsToApplyCoupon.reduce((acc: number, curr: CartItem) => acc + curr.total, 0);
      appliedCouponPrice = coupon.discount * numOfItems;
    } else {
      appliedCouponPrice = oldSumOfAppliedProducts * (coupon.discount / 100);
    }
    return {
      ...cart,
      appliedCouponPrice: roundPrice(appliedCouponPrice),
    };
  }

  public static resetCoupon(cart: Cart): Cart {
    return {
      ...cart,
      appliedCouponPrice: undefined,
    };
  }

  public static checkAvailability(items: CartItem, cart: Cart): boolean {
    const { availability } = items.info;
    if (availability === null || availability === undefined) {
      return true;
    }
    const currentTotal = cart.items
      .find((i: CartItem) => i.info._id.toString() === items.info._id.toString())?.total || 0;
    return currentTotal + items.total <= availability;
  }

  public static toCartItem(item: ProductItemPreview | CartItem): CartItem {
    let cartItem: CartItem = item as CartItem;
    if (!isCartItem(item)) {
      cartItem = {
        info: item,
        total: 1,
      };
    }
    return cartItem;
  }

  public static toServerCartItem(item: CartItem): ServerCartItem {
    return {
      total: item.total,
      info: item.info._id,
      selectedOption: item.info.selectedOption,
    };
  }

  private static removeFromCart(item: ServerCartItem, array: CartItem[]): CartItem[] {
    const cart = [...array];
    const idx = cart.findIndex(
      (i: CartItem) => (item.selectedOption ? item.selectedOption === i.info.selectedOption : true)
        && i.info._id.toString() === item.info.toString(),
    );
    if (idx < 0) {
      console.error('Provided item are not presented on cart');
      return cart;
    }

    const { total } = cart[idx];
    if (total === 1) {
      cart.splice(idx, total);
    } else {
      cart[idx] = {
        ...cart[idx],
        total: total - 1,
      };
    }

    return cart;
  }

  private static addToCart(item: CartItem, array: CartItem[]): CartItem[] {
    const cart = [...array];
    const idx = cart.findIndex(
      (c: CartItem) => (item.info.selectedOption ? item.info.selectedOption === c.info.selectedOption : true)
        && c.info._id.toString() === item.info._id.toString(),
    );

    if (idx >= 0) {
      cart[idx] = {
        ...cart[idx],
        total: cart[idx].total + item.total,
      };
    } else {
      cart.push(item);
    }

    return cart;
  }
}
