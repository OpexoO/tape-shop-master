import type { NextApiRequest, NextApiResponse } from 'next';
import httpMethods from '@/constants/httpMethods';
import dbConnect from '@/utils/db';
import Category from '@/models/Category';
import { Category as ICategory, NewCategory } from '@/interfaces/category';
import CategoryService from '@/services/category.service';
import { Types } from 'mongoose';
import { isValidString, isValidImage } from '@/utils/validTypes';
import HashHandlerService from '@/services/hash.service';

type Response = {
  data: string | ICategory;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>,
) {
  const { method } = req;
  const { id = '' } = req.query;

  if (!Types.ObjectId.isValid(id as string)) {
    res.status(404).json({ data: `There is no such product category with given ID: ${id}` });
    return;
  }

  try {
    await dbConnect();

    const objectId = new Types.ObjectId(id as string);
    const foundType = await Category.findById<Record<string, string>>(objectId).lean();

    if (!foundType) {
      res.status(404).json({ data: `There is no such product category with given ID: ${id}` });
      return;
    }

    if (method === httpMethods.get) {
      res.status(200).json({
        data: CategoryService.fromServer(foundType) as ICategory,
      });
    } else if (method === httpMethods.patch) {
      const verify = await HashHandlerService.verifyAdminToken(req.headers.authorization);
      if (!verify) {
        res.status(401).json({ data: 'Invalid access token or role' });
        return;
      }

      const { name, imageUrl } = req.body;
      const newName = CategoryService.trimName(name as string);

      const isValidName = isValidString(newName);
      const isValidImg = isValidImage(imageUrl);

      if (!isValidName && !isValidImg) {
        res.status(400).json({
          data: 'Name and image are required for product category and should be string and image file',
        });
        return;
      }

      const existedCategory = await Category.exists({ name: newName });
      if (existedCategory) {
        res.status(400).json({ data: `Product category with name ${newName} is alredy exists` });
        return;
      }

      let object: Partial<NewCategory> = {};
      if (isValidImg) {
        object = { ...object, imageUrl };
      }
      if (isValidName) {
        object = { ...object, name: newName };
      }

      const category = await Category.findByIdAndUpdate(objectId, object, {
        new: true,
      });
      res.status(201).json({ data: CategoryService.fromServer(category) as ICategory });
    } else if (method === httpMethods.delete) {
      const verify = await HashHandlerService.verifyAdminToken(req.headers.authorization);
      if (!verify) {
        res.status(401).json({ data: 'Invalid access token or role' });
        return;
      }

      await Category.findByIdAndDelete(objectId);
      res.status(200).json({
        data: CategoryService.fromServer(foundType) as ICategory,
      });
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
