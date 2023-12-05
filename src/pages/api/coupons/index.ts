import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/utils/db';
import httpMethods from '@/constants/httpMethods';
import itemsPerPage from '@/constants/perPage';
import Coupon from '@/models/Coupon';
import CouponsService from '@/services/coupons.service';
import { Query, SortOrder } from 'mongoose';
import { Coupon as ICoupon } from '@/interfaces/coupon';
import sortingValue from '@/constants/sortingValues';
import HashHandlerService from '@/services/hash.service';

type Response = {
  data: string | ICoupon | ICoupon[];
  total?: number;
};

const buildQuery = (params: NextApiRequest['query']) => {
  const {
    name, type, isActive, dateGte, dateLte,
    priceGte, priceLte, appliedProducts, sort, sortField,
  } = params;
  let query: Query<ICoupon[], ICoupon>;

  const filters: any = {};
  const priceFilter: any = {};
  if (name) {
    filters.name = { $regex: new RegExp(name as string, 'ig') };
  }
  if (type) {
    filters.type = type;
  }
  if (appliedProducts) {
    filters.appliedProducts = { $in: JSON.parse(appliedProducts as string) };
  }
  if (isActive) {
    filters.isActive = isActive;
  }
  if (dateGte) {
    filters.startDate = {};
    filters.startDate.$gte = dateGte;
  }
  if (dateLte) {
    filters.endDate = {};
    filters.endDate.$gte = dateLte;
  }
  if (priceGte) {
    priceFilter.$gte = +priceGte;
  }
  if (priceLte) {
    priceFilter.$lte = +priceLte;
  }
  if (priceFilter.$gte || priceFilter.$lte) {
    filters.discount = priceFilter;
  }
  query = Coupon.find(filters);

  const sortOption = +(sort as string) || (sort as string);
  if (sort && sortField && sortingValue.includes(sortOption)) {
    query = query.sort({ [sortField as string]: sort as SortOrder });
  }
  return query;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>,
) {
  const { method } = req;

  try {
    const verify = await HashHandlerService.verifyAdminToken(req.headers.authorization);
    if (!verify) {
      res.status(401).json({ data: 'Invalid access token or role' });
      return;
    }

    await dbConnect();

    if (method === httpMethods.get) {
      const page = +(req.query.page || 1);
      const limit = page > 0 ? +(req.query.perPage || itemsPerPage.categories) : 0;
      let toSkip: number = 0;
      if (page > 0) {
        toSkip = (page - 1) * limit;
      }

      const data = await buildQuery(req.query)
        .skip(toSkip)
        .limit(limit)
        .populate('userIds')
        .exec();
      const total = await Coupon.count();
      res.status(200).json({
        data: CouponsService.fromServer(data),
        total,
      });
    } else if (method === httpMethods.post) {
      const fields = CouponsService.toServer(req.body);
      const validation = CouponsService.validate(fields);
      if (typeof validation === 'string') {
        res.status(400).json({ data: validation });
        return;
      }

      const existed = await Coupon.exists({ code: fields.code });
      if (existed) {
        res.status(422).json({ data: 'Coupon with provided code already exists' });
        return;
      }
      const newCoupon = await Coupon.create(fields);
      res.status(201).json({ data: CouponsService.fromServer(newCoupon) });
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
