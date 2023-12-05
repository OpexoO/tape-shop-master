import type { NextApiRequest, NextApiResponse } from 'next';
import httpMethods from '@/constants/httpMethods';
import dbConnect from '@/utils/db';
import User from '@/models/User';
import { User as IUser } from '@/interfaces/user';
import HashHandlerService from '@/services/hash.service';
import UserService from '@/services/user.service';
import MailService from '@/services/mail.service';
import UserValidator from '@/validation/user.validator';

type Response = {
  data: string | IUser | IUser[];
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>,
) {
  const { method } = req;

  try {
    await dbConnect();

    if (method === httpMethods.get) {
      const { userEmail } = req.query as Record<string, string>;
      let data: IUser | IUser[];

      if (userEmail) {
        const verify = await HashHandlerService.verifyAdminToken(req.headers.authorization);
        if (!verify) {
          res.status(401).json({ data: 'Invalid access token' });
          return;
        }

        const users = await User.find({
          email: { $regex: new RegExp(userEmail as string, 'ig') },
        });
        data = (users || []).map(UserService.fromServer);
      } else {
        const verify = await HashHandlerService.verifyToken(req.headers.authorization);
        if (!verify) {
          res.status(401).json({ data: 'Invalid access token' });
          return;
        }

        data = UserService.fromServer(
          await User.findOne({ email: verify.email }),
        );
        if (!data) {
          res.status(404).json({ data: 'User not found' });
          return;
        }
      }
      res.status(200).json({ data });
    } else if (method === httpMethods.post) {
      const { email, name, password } = req.body;
      const validator = new UserValidator({ email, name, password });
      const validation = validator.isAllValid();
      if (typeof validation === 'string') {
        res.status(400).json({ data: validation });
        return;
      }

      const candidate = await User.exists({ email });
      if (candidate) {
        res.status(422).json({ data: 'User already exists' });
        return;
      }

      const hash = await HashHandlerService.hashData(`${Date.now().toString()}_${email}`);
      const hashPassword = await HashHandlerService.hashData(password);
      const user = await User.create(UserService.toServer(email, name, hashPassword, hash));
      await MailService.register(email, hash);
      res.status(201).json({ data: UserService.fromServer(user) });
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
