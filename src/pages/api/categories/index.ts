import type { NextApiRequest, NextApiResponse } from 'next';
import httpMethods from '@/constants/httpMethods';
import dbConnect from '@/utils/db';
import Category from '@/models/Category';
import { Category as ICategory, NewCategory } from '@/interfaces/category';
import CategoryService from '@/services/category.service';
import { isValidImage, isValidString } from '@/utils/validTypes';
import HashHandlerService from '@/services/hash.service';
import itemsPerPage from '@/constants/perPage';

type Response = {
  data: string | ICategory | ICategory[];
  total?: number;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>,
) {
  const { method } = req;

  try {
    await dbConnect();

    if (method === httpMethods.get) {
      const page = +(req.query.page || 1);
      const limit = page > 0 ? +(req.query.perPage || itemsPerPage.categories) : 0;
      let toSkip: number = 0;
      if (page > 0) {
        toSkip = (page - 1) * limit;
      }

      const categories = await Category
        .find({})
        .skip(toSkip)
        .limit(limit)
        .lean();
      const total = await Category.count();

      res.status(200).json({
        data: CategoryService.fromServer(categories),
        total,
      });
    } else if (method === httpMethods.post) {
      const verify = await HashHandlerService.verifyAdminToken(req.headers.authorization);
      if (!verify) {
        res.status(401).json({ data: 'Invalid access token or role' });
        return;
      }

      const { name, imageUrl } = req.body;
      const newName = CategoryService.trimName(name as string);

      if (!isValidString(newName) || !isValidImage(imageUrl)) {
        res.status(400).json({
          data: 'Name and image are required for product category and should be strings',
        });
        return;
      }

      const existedCategory = await Category.exists({ name: newName });
      if (existedCategory) {
        res.status(400).json({ data: `Product category with name ${newName} is alredy exists` });
        return;
      }

      const object: NewCategory = { name: newName, imageUrl };
      const category = await Category.create(object);
      res.status(201).json({ data: CategoryService.fromServer(category) });
    } else {
      console.warn(`There is no such handler for HTTP method: ${method}`);
      res.setHeader('Allow', [httpMethods.get, httpMethods.post]);
      res.status(405).json({ data: 'Method not allowed' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ data: 'Internal server error' });
  }
}
