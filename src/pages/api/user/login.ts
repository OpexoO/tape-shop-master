import type { NextApiRequest, NextApiResponse } from 'next';
import httpMethods from '@/constants/httpMethods';
import dbConnect from '@/utils/db';
import User from '@/models/User';
import { FullUser as IUser } from '@/interfaces/user';
import HashHandlerService from '@/services/hash.service';

type Response = {
  data: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>,
) {
  const { method } = req;
  try {
    await dbConnect();

    if (method === httpMethods.post) {
      const { email, password } = req.body;
      const candidate = await User.findOne<IUser>({ email });

      if (!candidate) {
        res.status(401).json({ data: 'Incorrect login data' });
        return;
      }
      if (!candidate.confirmed) {
        res.status(400).json({ data: 'Your account is not confirmed' });
        return;
      }

      const isSame = await HashHandlerService.compareHash(password, candidate.password);
      if (!isSame) {
        res.status(401).json({ data: 'Incorrect login data' });
        return;
      }

      const token = await HashHandlerService.createToken(candidate._id, candidate.email, candidate.isAdmin);
      res.status(200).json({ data: `Bearer ${token}` });
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
