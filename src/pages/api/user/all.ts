import type { NextApiRequest, NextApiResponse } from 'next';
import httpMethods from '@/constants/httpMethods';
import dbConnect from '@/utils/db';
import User from '@/models/User';
import { User as IUser } from '@/interfaces/user';
import HashHandlerService from '@/services/hash.service';
import UserService from '@/services/user.service';
import itemsPerPage from '@/constants/perPage';

type Response = {
  data: string | IUser[];
  total?: number;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>,
) {
  const { method } = req;

  try {
    await dbConnect();

    if (method === httpMethods.get) {
      const verify = await HashHandlerService.verifyAdminToken(req.headers.authorization);
      if (!verify) {
        res.status(401).json({ data: 'Invalid access token' });
        return;
      }

      const page = +(req.query.page || 1);
      const limit = page > 0 ? +(req.query.perPage || itemsPerPage.users) : 0;
      let toSkip: number = 0;
      if (page > 0) {
        toSkip = (page - 1) * limit;
      }
      const filters: any = {};
      if (req.query.email) {
        filters.email = { $regex: new RegExp(req.query.email as string, 'ig') };
      }
      const users = await User
        .find(filters)
        .skip(toSkip)
        .limit(limit)
        .exec();
      const total = await User.count(filters);
      res.status(200).json({
        data: users.map(UserService.fromServer),
        total,
      });
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
