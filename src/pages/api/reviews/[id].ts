import type { NextApiRequest, NextApiResponse } from 'next';
import httpMethods from '@/constants/httpMethods';
import dbConnect from '@/utils/db';
import Review from '@/models/Review';
import ReviewService from '@/services/review.service';
import { FullReview } from '@/interfaces/review';
import Product from '@/models/Product';
import { Types } from 'mongoose';
import HashHandlerService from '@/services/hash.service';
import { isBoolean } from '@/utils/validTypes';

type Response = {
  data: string | FullReview;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>,
) {
  const { method } = req;
  const { id = '' } = req.query;

  if (!Types.ObjectId.isValid(id as string)) {
    res.status(404).json({ data: `There is no such review with given ID: ${id}` });
    return;
  }

  try {
    await dbConnect();

    const objectId = new Types.ObjectId(id as string);
    const foundType = await Review.findById(objectId);

    if (!foundType) {
      res.status(404).json({ data: `There is no such review with given ID: ${id}` });
      return;
    }

    const verify = await HashHandlerService.verifyAdminToken(req.headers.authorization);
    if (!verify) {
      res.status(401).json({ data: 'Invalid access token or role' });
      return;
    }

    if (method === httpMethods.get) {
      res.status(200).json({ data: ReviewService.fromFullServer(foundType) as FullReview });
    } else if (method === httpMethods.patch) {
      const { isApproved, isChecked } = req.body;
      if (!isBoolean(isApproved) && !isBoolean(isChecked)) {
        res.status(400).json({ data: 'Provide isApproved or isChecked field' });
        return;
      }

      const obj: any = {};
      if (isBoolean(isApproved)) {
        obj.isApproved = isApproved;
      }
      if (isBoolean(isChecked)) {
        obj.isChecked = isChecked;
      }
      if (isChecked && isApproved) {
        const { productId } = foundType;
        const { rate } = await Product.findById(new Types.ObjectId(productId));
        const reviewsCount = (await Review.count({ productId, isApproved: true, isChecked: true })) || 0;
        const newRate = ((rate * reviewsCount) + foundType.rating) / (reviewsCount + 1);
        await Product.findByIdAndUpdate(productId, { rate: newRate });
      }
      const updated = await Review.findByIdAndUpdate(objectId, obj, { new: true });
      res.status(201).json({ data: ReviewService.fromFullServer(updated) as FullReview });
    } else if (method === httpMethods.delete) {
      if (foundType.isChecked && foundType.isApproved) {
        const { productId } = foundType;
        const { rate } = await Product.findById(new Types.ObjectId(productId));
        const reviewsCount = (await Review.count({ productId, isApproved: true, isChecked: true })) || 0;
        let newRate: number = 0;
        if (reviewsCount - 1 > 0) {
          newRate = ((rate * reviewsCount) - foundType.rating) / (reviewsCount - 1);
        }
        await Product.findByIdAndUpdate(productId, { rate: newRate });
      }
      await Review.findByIdAndDelete(objectId);
      res.status(200).json({ data: ReviewService.fromFullServer(foundType) as FullReview });
    } else {
      console.warn(`There is no such handler for HTTP method: ${method}`);
      res.setHeader('Allow', [httpMethods.get, httpMethods.post, httpMethods.delete]);
      res.status(405).json({ data: 'Method not allowed' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ data: 'Internal server error' });
  }
}
