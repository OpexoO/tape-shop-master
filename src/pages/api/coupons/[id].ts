import type { NextApiRequest, NextApiResponse } from 'next';
import httpMethods from '@/constants/httpMethods';
import dbConnect from '@/utils/db';
import HashHandlerService from '@/services/hash.service';
import { Coupon as ICoupon } from '@/interfaces/coupon';
import { Types } from 'mongoose';
import Coupon from '@/models/Coupon';
import CouponsService from '@/services/coupons.service';

type Response = {
  data: string | ICoupon;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>,
) {
  const { method } = req;
  const { id = '' } = req.query;

  if (!Types.ObjectId.isValid(id as string)) {
    res.status(404).json({ data: `There is no such coupon with given ID: ${id}` });
    return;
  }

  try {
    const verify = await HashHandlerService.verifyAdminToken(req.headers.authorization);
    if (!verify) {
      res.status(401).json({ data: 'Invalid access token or role' });
      return;
    }

    await dbConnect();

    const objectId = new Types.ObjectId(id as string);
    const found = await Coupon
      .findOne({ _id: objectId })
      .populate('userIds')
      .exec();

    if (!found) {
      res.status(404).json({ data: `There is no such coupon with given ID: ${id}` });
      return;
    }

    if (method === httpMethods.get) {
      res.status(200).json({ data: CouponsService.fromServer(found) as ICoupon });
    } else if (method === httpMethods.patch) {
      const obj = CouponsService.preparePatchedFields(req.body);
      if (typeof obj === 'string') {
        res.status(400).json({ data: obj });
        return;
      }

      const existed = await Coupon.findOne({
        _id: { $ne: found._id },
        code: obj.code,
      });
      if (existed) {
        res.status(422).json({ data: 'Coupon with provided code already exists' });
        return;
      }

      let updated = found;
      if (Object.keys(obj).length) {
        updated = await Coupon
          .findByIdAndUpdate(objectId, obj, { new: true })
          .populate('userIds')
          .exec();
      }
      res.status(200).json({ data: CouponsService.fromServer(updated) as ICoupon });
    } else if (method === httpMethods.delete) {
      await Coupon.findByIdAndDelete(objectId);
      res.status(200).json({ data: CouponsService.fromServer(found) as ICoupon });
    } else {
      console.warn(`There is no such handler for HTTP method: ${method}`);
      res.setHeader('Allow', [httpMethods.get, httpMethods.patch, httpMethods.delete]);
      res.status(405).json({ data: 'Method not allowed' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ data: 'Internal server error' });
  }
}
