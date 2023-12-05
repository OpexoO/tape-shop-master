import type { NextApiRequest, NextApiResponse } from 'next';
import httpMethods from '@/constants/httpMethods';
import dbConnect from '@/utils/db';
import ContactFeedback from '@/models/ContactFeedback';
import ContactFeedbackService from '@/services/contactFeedback.service';
import { ContactFeedback as IContactFeedback } from '@/interfaces/contactFeedback';
import { Types } from 'mongoose';
import { isBoolean } from '@/utils/validTypes';
import HashHandlerService from '@/services/hash.service';

type Response = {
  data: string | IContactFeedback;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>,
) {
  const { method } = req;
  const { id } = req.query;

  if (!Types.ObjectId.isValid(id as string)) {
    res.status(404).json({ data: `There is no such contact feedback with given ID: ${id}` });
    return;
  }

  try {
    await dbConnect();

    const verify = await HashHandlerService.verifyAdminToken(req.headers.authorization);
    if (!verify) {
      res.status(401).json({ data: 'Invalid access token or role' });
      return;
    }

    const objectId = new Types.ObjectId(id as string);
    const foundFeedback = await ContactFeedback.findById(objectId);

    if (!foundFeedback) {
      res.status(404).json({ data: `There is no such contact feedback with given ID: ${id}` });
      return;
    }

    if (method === httpMethods.get) {
      res.status(200).json({ data: ContactFeedbackService.fromServer(foundFeedback) as IContactFeedback });
    } else if (method === httpMethods.patch) {
      const { reviewed } = req.body;
      if (!isBoolean(reviewed)) {
        res.status(400).json({ data: 'Reviewed flag should be boolean' });
        return;
      }

      const updated = await ContactFeedback.findByIdAndUpdate(objectId, { reviewed }, { new: true });
      res.status(200).json({ data: ContactFeedbackService.fromServer(updated) as IContactFeedback });
    } else if (method === httpMethods.delete) {
      await ContactFeedback.findByIdAndDelete(objectId);
      res.status(200).json({ data: 'Contact feedback has been sucessfully deleted' });
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
