import type { NextApiRequest, NextApiResponse } from 'next';
import httpMethods from '@/constants/httpMethods';
import dbConnect from '@/utils/db';
import Cart from '@/models/Cart';
import CartService from '@/services/cart.service';
import EncryptionService from '@/services/encryption.service';
import { Cart as ICart } from '@/interfaces/cart';
import { isValidObjectId } from 'mongoose';
import User from '@/models/User';

type Response = {
  data?: ICart;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>,
) {
  const { method } = req;

  try {
    await dbConnect();

    if (method === httpMethods.post) {
      const { userId, iv, cart } = req.body;
      if (!userId || !iv) {
        res.status(400).json({ error: 'Provide information about session' });
        return;
      }

      let newCart: Partial<ICart> = cart;
      const validation = CartService.validate(cart);
      if (!cart || typeof validation === 'string') {
        newCart = CartService.initialCartState;
      }

      const encryptionService = new EncryptionService('');
      const encryptedUserId = await encryptionService.decrypt(userId, iv);
      if (!isValidObjectId(encryptedUserId)) {
        res.status(400).json({ error: 'Provide valid session id' });
        return;
      }
      newCart.userId = encryptedUserId;
      newCart.lastUpdated = new Date();

      const foundCart = await Cart.exists({ userId: encryptedUserId });
      if (foundCart) {
        res.status(400).json({ error: 'Cart has already created for this user' });
        return;
      }

      const monthsToKeep = 4;
      const date = new Date();
      date.setMonth(date.getMonth() + monthsToKeep);

      const cartToCreate = { ...CartService.toServer(newCart) };
      const foundUser = await User.exists({ _id: newCart.userId });
      if (!foundUser) {
        cartToCreate.expiryDate = date;
      }
      await Cart.create(cartToCreate);

      const createdCart = await Cart
        .findOne({ userId: encryptedUserId })
        .populate({
          path: 'items.info',
          populate: {
            path: 'categories',
          },
        })
        .exec();
      res.status(201).json({ data: CartService.fromServer(createdCart) });
    } else {
      console.warn(`There is no such handler for HTTP method: ${method}`);
      res.setHeader('Allow', [httpMethods.post]);
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
