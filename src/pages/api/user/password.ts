import type { NextApiRequest, NextApiResponse } from 'next';
import httpMethods from '@/constants/httpMethods';
import dbConnect from '@/utils/db';
import User from '@/models/User';
import { PASSWORD_REGEX } from '@/constants/regex';
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
      const { hash = '', password = '' } = req.body;
      if (!hash || !PASSWORD_REGEX.test(password)) {
        res.status(400).json({ data: 'Invalid data provided' });
        return;
      }

      const user = await User.findOne({
        hash,
        hashExp: { $gt: Date.now() },
      });
      if (!user) {
        res.status(400).json({ data: 'Invalid reset link or link has been expired' });
        return;
      }

      user.hash = null;
      user.hashExp = null;
      user.password = await HashHandlerService.hashData(password);
      await user.save();
      res.status(200).json({ data: 'Password has changed succesfully' });
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
