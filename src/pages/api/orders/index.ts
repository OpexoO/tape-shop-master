import type { NextApiRequest, NextApiResponse } from 'next';
import httpMethods from '@/constants/httpMethods';
import dbConnect from '@/utils/db';
import HashHandlerService from '@/services/hash.service';
import Order from '@/models/Order';
import OrderValidator from '@/validation/order.validator';
import OrderService from '@/services/order.service';
import { Order as IOrder, PreparedOrder, PreparedOrderItem, ReturnedOrder } from '@/interfaces/order';
import Product from '@/models/Product';
import { Product as IProduct } from '@/interfaces/product/product';
import itemsPerPage from '@/constants/perPage';
import OrderReturned from '@/models/OrderReturned';
import { SortOrder } from 'mongoose';
import sortingValue from '@/constants/sortingValues';
import returnStatuses from '@/constants/returnStatuses';

type ApiResponse = {
  data: string | IOrder | IOrder[] | ReturnedOrder[];
  total?: number;
}

interface FilterOptions {
  sort: string;
  status: keyof typeof returnStatuses;
  dateGte: string;
  dateLte: string;
}

const buildFilterQuery = (params: unknown) => {
  const { sort, status, dateGte, dateLte } = params as FilterOptions;
  let query;

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
  if (returnStatuses[status]) {
    filter.status = status;
  }
  query = OrderReturned.find(filter).populate('user');

  const sortOption = +sort || sort;
  if (sortingValue.includes(sortOption)) {
    query = query.sort({ date: sortOption as SortOrder });
  }

  return query;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>,
) {
  const { method } = req;

  try {
    const payload = await HashHandlerService.verifyToken(req.headers.authorization);
    if (!payload) {
      res.status(401).json({ data: 'Invalid access token' });
      return;
    }

    await dbConnect();

    if (method === httpMethods.get) {
      if (req.query.returned === 'true') {
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

        const orders = await query
          .lean()
          .skip(toSkip)
          .limit(limit)
          .exec();
        const total = await OrderReturned.count();
        res.status(200).json({
          data: orders.map(OrderService.returnedFromServer) as ReturnedOrder[],
          total,
        });
      } else {
        const orders = await Order
          .find({ userId: payload.id })
          .sort({ date: 'desc' });
        const promisifyOrders = orders.map(async (o: PreparedOrder) => {
          const orderProducts = await Promise.all(o.items
            .map((v: PreparedOrderItem) => Product.findById<IProduct>(v.info))
            .filter(Boolean));
          return OrderService.fromServer(o, orderProducts as IProduct[]);
        });
        res.status(200).json({ data: await Promise.all(promisifyOrders) });
      }
    } else if (method === httpMethods.post) {
      const fields = OrderService.prepareFieds(req.body, payload.id);
      const existed = await Order.findOne({ orderId: fields.orderId });
      if (existed) {
        res.status(400).json({ data: 'Provided order id already exists' });
        return;
      }

      const validator = new OrderValidator(fields);
      const validation = validator.isAllValid();
      if (typeof validation === 'string') {
        res.status(400).json({ data: validation });
        return;
      }

      await Order.create(fields);
      const order = await Order.findOne({ orderId: fields.orderId });
      const products = await Promise.all(
        order.items
          .map((i: PreparedOrderItem) => Product.findById(i.info))
          .filter(Boolean),
      );
      res.status(201).json({ data: OrderService.fromServer(order, products) });
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
