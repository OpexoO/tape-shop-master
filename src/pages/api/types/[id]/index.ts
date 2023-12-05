import type { NextApiRequest, NextApiResponse } from 'next';
import httpMethods from '@/constants/httpMethods';
import dbConnect from '@/utils/db';
import { Type as IType, NewType } from '@/interfaces/type';
import Type from '@/models/Type';
import TypeService from '@/services/type.service';
import { isValidObjectId } from 'mongoose';
import HashHandlerService from '@/services/hash.service';

type Response = {
  data: string | IType;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>,
) {
  const { method } = req;
  const { id } = req.query;

  try {
    await dbConnect();
    const foundType = await TypeService.findById(id as string);

    if (!foundType) {
      res.status(404).json({ data: `There is no such product type with given ID: ${id}` });
      return;
    }

    if (method === httpMethods.get) {
      res.status(200).json({
        data: TypeService.fromServer(foundType as unknown as Record<string, string>) as IType,
      });
    } else if (method === httpMethods.patch) {
      const verify = await HashHandlerService.verifyAdminToken(req.headers.authorization);
      if (!verify) {
        res.status(401).json({ data: 'Invalid access token or role' });
        return;
      }

      const { name, categories } = req.body;
      const generateId = TypeService.generateId(name);

      if (!generateId && !categories) {
        res.status(400).json({ data: 'Name or categories are required for product type' });
        return;
      }
      if (categories && (!Array.isArray(categories) || !categories.every(isValidObjectId))) {
        res.status(400).json({ data: 'Categories should be array of ID\'s' });
        return;
      }

      const existedType = await Type.findOne({ id: generateId });
      if (existedType) {
        res.status(400).json({ data: `Product type with name ${name} is alredy exists` });
        return;
      }

      let obj: Partial<NewType> = {};
      if (generateId) {
        obj = { ...obj, name, id: generateId };
      }
      if (categories) {
        obj = { ...obj, categories };
      }

      const type = await Type.findOneAndUpdate({ id }, TypeService.toServer(obj), {
        new: true,
      }).populate('categories').exec();
      res.status(201).json({ data: TypeService.fromServer(type) as IType });
    } else if (method === httpMethods.delete) {
      const verify = await HashHandlerService.verifyAdminToken(req.headers.authorization);
      if (!verify) {
        res.status(401).json({ data: 'Invalid access token or role' });
        return;
      }

      await Type.findOneAndDelete({ id });
      res.status(200).json({
        data: TypeService.fromServer(foundType as unknown as Record<string, string>) as IType,
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
