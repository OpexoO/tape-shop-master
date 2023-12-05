import type { NextApiRequest, NextApiResponse } from 'next';
import httpMethods from '@/constants/httpMethods';
import dbConnect from '@/utils/db';
import { Query, SortOrder, Types, isValidObjectId } from 'mongoose';
import Review from '@/models/Review';
import ReviewService from '@/services/review.service';
import { FullReview, Review as IReview } from '@/interfaces/review';
import Product from '@/models/Product';
import sortingValue from '@/constants/sortingValues';
import itemsPerPage from '@/constants/perPage';
import HashHandlerService from '@/services/hash.service';
import ReviewValidator from '@/validation/review.validator';

type Response = {
  data: string | IReview | FullReview[];
  total?: number;
};

interface FilterOptionsState {
  sort: string;
  reviewed: string;
  dateGte: string;
  dateLte: string;
  productId: string;
  approved: string;
  rating: string;
}

const buildQuery = (params: unknown) => {
  const { sort, productId, dateGte, dateLte,
    reviewed, approved, rating } = params as FilterOptionsState;
  let query: Query<IReview[], IReview>;

  const filter: any = {};
  const dateFilter: any = {};
  if (productId && isValidObjectId(productId)) {
    filter.productId = productId;
  }
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
    filter.isChecked = reviewed === 'true';
  }
  if (['true', 'false'].includes(approved)) {
    filter.isApproved = approved === 'true';
  }
  if (rating) {
    filter.rating = { $in: JSON.parse(rating) };
  }
  query = Review.find(filter);

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

      const page = +(req.query.page || 1);
      const limit = page > 0 ? +(req.query.perPage || itemsPerPage.reviews) : 0;
      let toSkip: number = 0;
      if (page > 0) {
        toSkip = (page - 1) * limit;
      }

      const reviews = await buildQuery(req.query)
        .skip(toSkip)
        .limit(limit)
        .exec();
      const total = await Review.count();
      res.status(200).json({
        data: ReviewService.fromFullServer(reviews) as FullReview[],
        total,
      });
    } else if (method === httpMethods.post) {
      const fields = ReviewService.prepareFields(req.body);
      const validator = new ReviewValidator(fields);
      const result = validator.isAllValid();

      if (typeof result === 'string') {
        res.status(400).json({ data: result });
        return;
      }
      const product = await Product.findById(new Types.ObjectId(fields.productId));
      if (!product) {
        res.status(404).json({ data: 'There is no product with given ID' });
        return;
      }

      const review = await Review.create(ReviewService.toServer(fields));
      res.status(201).json({ data: ReviewService.fromServer(review) as IReview });
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
