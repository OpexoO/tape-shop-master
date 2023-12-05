import type { NextApiRequest, NextApiResponse } from 'next';
import httpMethods from '@/constants/httpMethods';
import dbConnect from '@/utils/db';
import ContactFeedback from '@/models/ContactFeedback';
import ContactFeedbackService from '@/services/contactFeedback.service';
import { ContactFeedback as IContactFeedback, ServerContactFeedback } from '@/interfaces/contactFeedback';
import sortingValue from '@/constants/sortingValues';
import { Query, SortOrder } from 'mongoose';
import itemsPerPage from '@/constants/perPage';
import HashHandlerService from '@/services/hash.service';
import ContactFeedbackValidator from '@/validation/contactFeedback.validator';

type Response = {
  data: string | IContactFeedback | IContactFeedback[];
  total?: number;
}

interface FilterOptions {
  sort: string;
  reviewed: string;
  dateGte: string;
  dateLte: string;
}

const buildFilterQuery = (params: unknown) => {
  const { sort, reviewed, dateGte, dateLte } = params as FilterOptions;
  let query: Query<ServerContactFeedback[], ServerContactFeedback>;

  const filter: any = {};
  const dateFilter: any = {};
  if (dateGte) {
    dateFilter.$gte = dateGte;
  }
  if (dateLte) {
    dateFilter.$lte = dateLte;
  }
  if (dateFilter.$gte || dateFilter.$lte) {
    filter.date = dateFilter;
  }
  if (['true', 'false'].includes(reviewed)) {
    filter.reviewed = reviewed === 'true';
  }
  query = ContactFeedback.find(filter);

  const sortOption = +sort || sort;
  if (sortingValue.includes(sortOption)) {
    query = query.sort({ date: sortOption as SortOrder });
  }

  return query;
};

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
        res.status(401).json({ data: 'Invalid access token or role' });
        return;
      }

      const query = buildFilterQuery(req.query as unknown);
      const page = +(req.query.page || 1);
      const limit = page > 0 ? +(req.query.perPage || itemsPerPage.feedbacks) : 0;
      let toSkip: number = 0;
      if (page > 0) {
        toSkip = (page - 1) * limit;
      }

      const feedbacks = await query
        .lean()
        .skip(toSkip)
        .limit(limit)
        .exec();
      const total = await ContactFeedback.count();
      res.status(200).json({
        data: ContactFeedbackService.fromServer(feedbacks) as IContactFeedback[],
        total,
      });
    } else if (method === httpMethods.post) {
      const fields = ContactFeedbackService.prepareFields(req.body);
      const validator = new ContactFeedbackValidator(fields);
      const result = validator.isAllValid();

      if (typeof result === 'string') {
        res.status(400).json({ data: result });
        return;
      }

      await ContactFeedback.create(ContactFeedbackService.toServer(fields));
      res.status(201).json({ data: 'Your feedback has been sent successfully' });
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
