import type { NextApiRequest, NextApiResponse } from 'next';
import { randomBytes } from 'crypto';
import httpMethods from '@/constants/httpMethods';
import dbConnect from '@/utils/db';
import User from '@/models/User';
import { isValidEmail } from '@/utils/validTypes';
import MailService from '@/services/mail.service';
import { MIN_IN_H, MS_IN_SEC, SEC_IN_MIN } from '@/constants/time';

type Response = {
  data: string;
}

const BYTES = 32;

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
        res.status(400).json({ data: 'Invalid reset link' });
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

      res.status(200).json({ data: 'Reset your password' });
    } else if (method === httpMethods.post) {
      const { email } = req.body;
      if (!isValidEmail(email)) {
        res.status(400).json({ data: 'Provide valid email' });
        return;
      }

      const candidate = await User.findOne({ email, confirmed: true });
      if (!candidate) {
        res.status(404).json({ data: 'Invalid email provided or account not verified' });
        return;
      }

      const hash = randomBytes(BYTES).toString('hex');
      candidate.hash = hash;
      candidate.hashExp = Date.now() + (MIN_IN_H * SEC_IN_MIN * MS_IN_SEC);
      await candidate.save();
      MailService.reset(email, hash);
      res.status(200).json({ data: 'Email with reset link has been sent' });
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
