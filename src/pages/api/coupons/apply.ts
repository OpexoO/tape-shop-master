import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/utils/db';
import httpMethods from '@/constants/httpMethods';
import HashHandlerService from '@/services/hash.service';
import Coupon from '@/models/Coupon';
import CouponsService from '@/services/coupons.service';
import { FullUser } from '@/interfaces/user';
import User from '@/models/User';
import { AppliedCoupon } from '@/interfaces/coupon';

type Response = {
  data: string | AppliedCoupon;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>,
) {
  const { method } = req;

  try {
    await dbConnect();

    if (method === httpMethods.post) {
      const { code } = req.body;
      const token = await HashHandlerService.verifyToken(req.headers.authorization);
      let user: FullUser | null = null;
      if (token) {
        user = await User.findOne({ _id: token.id });
      }

      const coupon = await Coupon
        .findOne({ code })
        .populate('userIds')
        .exec();
      const result = CouponsService.apply(coupon, user);
      res
        .status(typeof result === 'string' ? 400 : 200)
        .json({ data: result });
    } else {
      console.warn(`There is no such handler for HTTP method: ${method}`);
      res.setHeader('Allow', [httpMethods.post]);
      res.status(405).json({ data: 'Method not allowed' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ data: 'Internal server error' });
  }
}
