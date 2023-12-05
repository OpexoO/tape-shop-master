import type { NextApiRequest, NextApiResponse } from 'next';
import httpMethods from '@/constants/httpMethods';
import dbConnect from '@/utils/db';
import Cart from '@/models/Cart';
import CartService from '@/services/cart.service';
import { Query, Types, isValidObjectId } from 'mongoose';
import { cartActions } from '@/constants/cartActions';
import { Cart as ICart, CartActionRequest } from '@/interfaces/cart';
import Product from '@/models/Product';
import ProductService from '@/services/product.service';
import { Product as IProduct, ProductItemPreview } from '@/interfaces/product/product';
import CouponValidator from '@/validation/coupon.validator';
import HashHandlerService from '@/services/hash.service';
import { isShippingDestination } from '@/interfaces/shippingRates';
import { getOptionPrice } from '@/interfaces/product/productOption';

type Response = {
  data?: ICart;
  error?: string;
};

const populateCart = (query: Query<any, any>) => query
  .populate({
    path: 'items.info',
    populate: {
      path: 'categories',
    },
  })
  .exec();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>,
) {
  const { method } = req;
  const { id = '' } = req.query;

  if (!Types.ObjectId.isValid(id as string)) {
    res.status(404).json({ error: 'You don\'t have saved cart' });
    return;
  }

  try {
    await dbConnect();

    const token = req.headers.authorization;
    if (token) {
      const verify = await HashHandlerService.verifyToken(token);
      if (!verify) {
        res.status(401).json({ error: 'Your token has expired, you were logged out' });
        return;
      }
    }

    const objectId = new Types.ObjectId(id as string);
    const foundCart = await populateCart(Cart.findOne<Record<string, string>>({ userId: objectId }));
    if (!foundCart) {
      res.status(404).json({ error: 'You don\'t have saved cart' });
      return;
    }

    if (method === httpMethods.get) {
      const data = CartService.refresh(CartService.fromServer(foundCart));
      res.status(200).json({ data });
    } else if (method === httpMethods.delete) {
      await Cart.findOneAndDelete({ userId: objectId });
      res.status(200).json({ data: CartService.fromServer(foundCart) });
    } else if (method === httpMethods.patch) {
      const { action, item, coupon, shippingDestination } = req.body as CartActionRequest;
      let newCart: ICart = CartService.refresh(CartService.fromServer(foundCart));

      switch (action) {
        case cartActions.Add: {
          if (!item || item?.total === 0 || !item?.info || !isValidObjectId(item?.info)) {
            res.status(400).json({ data: newCart, error: 'Provide item to add' });
            return;
          }
          const product = await (
            Product.findById(item.info).populate('categories').exec()
          ) as IProduct;
          if (!product) {
            res.status(400).json({ data: newCart, error: 'Provide item to add' });
            return;
          }
          const newItem = {
            info: ProductService.toPreview(product) as ProductItemPreview,
            total: item.total,
          };
          if (newItem.info.withOptions && item.selectedOption) {
            const optionPrice = getOptionPrice(product.options!, item.selectedOption);
            if (optionPrice) {
              newItem.info.selectedOption = item.selectedOption;
              newItem.info.price = optionPrice;
            }
          }
          if (!CartService.checkAvailability(newItem, newCart)) {
            res.status(400).json({
              data: newCart,
              error: `You cannot add that amount to the cart — 
              total amount will be more than we have in stock.`,
            });
            return;
          }
          newCart = CartService.addItems(newItem, newCart);
          break;
        }
        case cartActions.Remove: {
          if (!item || !item?.info || !isValidObjectId(item?.info)) {
            res.status(400).json({ data: newCart, error: 'Provide item to delete' });
            return;
          }
          newCart = CartService.removeItem(item, newCart);
          break;
        }
        case cartActions.RemoveAll: {
          if (!item || !item?.info || !isValidObjectId(item?.info)) {
            res.status(400).json({ data: newCart, error: 'Provide item to delete' });
            return;
          }
          newCart = CartService.removeAllItem(item, newCart);
          break;
        }
        case cartActions.Coupon: {
          const validator = new CouponValidator(coupon);
          if (coupon !== null && !validator.isAllValid()) {
            res.status(400).json({ data: newCart, error: 'Provide valid coupon' });
            return;
          }
          newCart.coupon = coupon;
          break;
        }
        case cartActions.Shipping: {
          if (shippingDestination === null || isShippingDestination(shippingDestination)) {
            newCart.shippingDestination = shippingDestination || null;
          } else {
            res.status(400).json({ data: newCart, error: 'Provide valid shipping destination' });
          }
          break;
        }
        default:
          console.warn(`No such cart action: ${action}`);
          break;
      }

      if (newCart.coupon) {
        const result = CartService.applyCoupon(newCart, newCart.coupon);
        if (typeof result === 'string') {
          newCart.appliedCouponPrice = 0;
          newCart.coupon = null;
          res.status(400).json({ data: newCart, error: result });
          return;
        }
        newCart = result;
      } else {
        newCart.appliedCouponPrice = 0;
      }

      await Cart.findOneAndUpdate({ userId: objectId }, {
        ...newCart,
        items: newCart.items.map(CartService.toServerCartItem),
        lastUpdated: new Date(),
      });
      res.status(200).json({ data: newCart });
    } else {
      console.warn(`There is no such handler for HTTP method: ${method}`);
      res.setHeader('Allow', [httpMethods.get, httpMethods.patch, httpMethods.delete]);
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
