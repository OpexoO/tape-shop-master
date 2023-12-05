import type { NextApiRequest, NextApiResponse } from 'next';
import httpMethods from '@/constants/httpMethods';
import dbConnect from '@/utils/db';
import HashHandlerService from '@/services/hash.service';
import Order from '@/models/Order';
import { Order as IOrder, ReturnedOrder } from '@/interfaces/order';
import trackingStatuses from '@/constants/trackingStatuses';
import OrderReturned from '@/models/OrderReturned';
import { isValidString } from '@/utils/validTypes';
import returnStatuses from '@/constants/returnStatuses';
import OrderService from '@/services/order.service';

type Response = {
  data: string | ReturnedOrder;
}

const buildQuery = (id: string) => OrderReturned
  .findOne({ orderId: id })
  .populate('user')
  .exec();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>,
) {
  const { method } = req;
  const { id = '' } = req.query;

  try {
    await dbConnect();

    if (method === httpMethods.get) {
      const payload = await HashHandlerService.verifyAdminToken(req.headers.authorization);
      if (!payload) {
        res.status(401).json({ data: 'Invalid access token or role' });
        return;
      }

      const returned = await buildQuery(id as string);
      if (!returned) {
        res.status(404).json({ data: 'Given return request is not found' });
        return;
      }
      res.status(200).json({ data: OrderService.returnedFromServer(returned) });
    } else if (method === httpMethods.post) {
      const payload = await HashHandlerService.verifyToken(req.headers.authorization);
      if (!payload) {
        res.status(401).json({ data: 'Invalid access token' });
        return;
      }

      const order = await Order.findOne<IOrder>({ userId: payload.id, orderId: id });
      if (!order) {
        res.status(403).json({ data: 'You don\'t have a given order' });
        return;
      }
      if (order.status !== trackingStatuses.Delivered) {
        res.status(400).json({ data: 'This order hasn\'t been delivered yet' });
        return;
      }

      const { message, reason } = req.body;
      if (!isValidString(message) || !isValidString(reason)) {
        res.status(400).json({ data: 'Provide reason and message to return an order' });
        return;
      }
      await OrderReturned.create({
        orderId: id,
        user: payload.id,
        status: returnStatuses.Created,
        message,
        reason,
      });
      res.status(201).json({ data: 'Return request for order has been created' });
    } else if (method === httpMethods.patch) {
      const payload = await HashHandlerService.verifyAdminToken(req.headers.authorization);
      if (!payload) {
        res.status(401).json({ data: 'Invalid access token or role' });
        return;
      }
      const exists = await OrderReturned.exists({ orderId: id });
      if (!exists) {
        res.status(404).json({ data: 'Given return request is not found' });
        return;
      }
      const status = req.body.status as keyof typeof returnStatuses;
      if (!returnStatuses[status]) {
        res.status(400).json({ data: 'Provide valid status to update return order' });
        return;
      }

      const updated = await OrderReturned
        .findOneAndUpdate({ orderId: id }, { status }, { new: true })
        .populate('user')
        .exec();
      res.status(200).json({ data: OrderService.returnedFromServer(updated) });
    } else if (method === httpMethods.delete) {
      const verify = await HashHandlerService.verifyAdminToken(req.headers.authorization);
      if (!verify) {
        res.status(401).json({ data: 'Invalid access token or role' });
        return;
      }
      const returned = await buildQuery(id as string);
      if (!returned) {
        res.status(404).json({ data: 'Given return request is not found' });
        return;
      }

      await OrderReturned.findOneAndDelete({ orderId: id });
      res.status(200).json({ data: OrderService.returnedFromServer(returned) });
    } else {
      console.warn(`There is no such handler for HTTP method: ${method}`);
      res.setHeader('Allow', [httpMethods.get, httpMethods.post, httpMethods.patch, httpMethods.delete]);
      res.status(405).json({ data: 'Method not allowed' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ data: 'Internal server error' });
  }
}
