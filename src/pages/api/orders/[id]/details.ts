import type { NextApiRequest, NextApiResponse } from 'next';
import httpMethods from '@/constants/httpMethods';
import dbConnect from '@/utils/db';
import HashHandlerService from '@/services/hash.service';
import { ShippingOrderResponse } from '@/interfaces/shippingOrders';
import fetch from 'node-fetch';
import LinkService from '@/services/link.service';
import ShippingService from '@/services/shipping.service';
import Order from '@/models/Order';
import OrderService from '@/services/order.service';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ShippingOrderResponse>,
) {
  const { method } = req;
  const { id } = req.query;

  try {
    const payload = await HashHandlerService.verifyToken(req.headers.authorization);
    if (!payload) {
      res.status(401).json({
        success: false,
        errors: [{ message: '', details: 'Invalid access token' }],
      });
      return;
    }

    if (method === httpMethods.get) {
      await dbConnect();

      const exists = await Order.exists({ userId: payload.id, orderId: id });
      if (!exists) {
        res.status(403).json({
          success: false,
          errors: [{ message: '', details: 'Access to order forbidden' }],
        });
        return;
      }

      const response = await fetch(`${LinkService.shippingOrdersLink()}?order_number=${id}`, {
        headers: { ...ShippingService.prepareHeaders() },
      });
      const order = await response.json() as ShippingOrderResponse;
      if (!response.ok || !order.order) {
        res.status(400).json(order);
        return;
      }

      order.order! = OrderService.shippingOrderFromServer(order.order!);
      res.status(200).json(order);
    } else {
      console.warn(`There is no such handler for HTTP method: ${method}`);
      res.setHeader('Allow', [httpMethods.get]);
      res.status(405).json({
        success: false,
        errors: [{ message: '', details: 'Method not allowed' }],
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      errors: [{ message: '', details: 'Internal server error' }],
    });
  }
}
