import type { NextApiRequest, NextApiResponse } from 'next';
import httpMethods from '@/constants/httpMethods';
import dbConnect from '@/utils/db';
import Cart from '@/models/Cart';
import { CartItem, Cart as ICart, NewServerCart, ServerCartItem } from '@/interfaces/cart';
import CartService from '@/services/cart.service';
import HashHandlerService from '@/services/hash.service';
import { Query, Types } from 'mongoose';
import Product from '@/models/Product';
import { Product as IProduct, ProductItemPreview } from '@/interfaces/product/product';
import ProductService from '@/services/product.service';

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
    const foundCart = CartService.fromServer(
      await populateCart(Cart.findOne<Record<string, string>>({ userId: objectId }).lean()),
    );
    if (!foundCart) {
      res.status(404).json({ error: 'You don\'t have saved cart' });
      return;
    }

    if (method === httpMethods.patch) {
      const { savedCart }: { savedCart: NewServerCart & ICart } = req.body;

      const validate = CartService.validate(savedCart);
      if (typeof validate === 'string') {
        res.status(400).json({ data: foundCart, error: 'Provide valid cart to merge' });
        return;
      }

      const products = await Promise.all(
        savedCart.items.map((i: ServerCartItem) => Product.findById<IProduct>(i.info).lean()),
      );
      const productsPreview: ProductItemPreview[] = [];
      products.forEach((p: unknown, idx: number) => {
        if (p) {
          productsPreview.push({
            ...ProductService.toPreview(p as IProduct) as ProductItemPreview,
            selectedOption: savedCart.items[idx].selectedOption,
          });
        }
      });
      const newItems: CartItem[] = productsPreview.map((p: ProductItemPreview) => ({
        info: p,
        total: savedCart.items
          .find(
            (i: ServerCartItem) => i.info.toString() === p._id.toString()
              && i.selectedOption === p.selectedOption,
          )?.total || 0,
      }));

      const merged = CartService.mergeCarts(foundCart, { ...savedCart, items: newItems } as ICart);
      const updated = await populateCart(Cart.findOneAndUpdate(
        { userId: objectId },
        {
          ...merged,
          items: (merged.items || []).map(CartService.toServerCartItem),
          lastUpdated: new Date(),
        },
        { new: true },
      ).lean());
      res.status(200).json({ data: CartService.refresh(CartService.fromServer(updated)) });
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
