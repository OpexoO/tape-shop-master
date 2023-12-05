import type { NextApiRequest, NextApiResponse } from 'next';
import httpMethods from '@/constants/httpMethods';
import dbConnect from '@/utils/db';
import { Types, isValidObjectId } from 'mongoose';
import Product from '@/models/Product';
import ProductService from '@/services/product.service';
import { ProductItem } from '@/interfaces/product/product';

type Response = {
  data: string | ProductItem | ProductItem[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>,
) {
  const { method } = req;
  const { id } = req.query;

  try {
    await dbConnect();

    if (method === httpMethods.get) {
      if (!isValidObjectId(id)) {
        res.status(400).json({ data: 'Provide valid id for product type' });
        return;
      }

      const products = await Product.find({ productType: new Types.ObjectId(id as string) });
      res.status(200).json({ data: ProductService.fromServer(products) });
    } else {
      console.warn(`There is no such handler for HTTP method: ${method}`);
      res.setHeader('Allow', httpMethods.get);
      res.status(405).json({ data: 'Method not allowed' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ data: 'Internal server error' });
  }
}
