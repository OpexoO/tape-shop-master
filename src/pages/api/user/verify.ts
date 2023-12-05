import type { NextApiRequest, NextApiResponse } from 'next';
import httpMethods from '@/constants/httpMethods';
import dbConnect from '@/utils/db';
import User from '@/models/User';

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

    if (method === httpMethods.get) {
      const { hash } = req.query;
      if (!hash) {
        res.status(422).json({ data: 'Invalid verify link' });
        return;
      }

      const user = await User.findOne({ hash });
      if (!user) {
        res.status(404).json({ data: 'User not found' });
        return;
      }
      if (user.confirmed) {
        res.status(200).json({ data: 'Account already verified' });
        return;
      }
      user.confirmed = true;
      await user.save();
      res.status(200).json({ data: 'Your account has been verified succesfully' });
    } else {
      console.warn(`There is no such handler for HTTP method: ${method}`);
      res.setHeader('Allow', [httpMethods.get]);
      res.status(405).json({ data: 'Method not allowed' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ data: 'Internal server error' });
  }
}
