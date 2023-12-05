/* eslint-disable camelcase */
import type { NextApiRequest, NextApiResponse } from 'next';
import httpMethods from '@/constants/httpMethods';
import dbConnect from '@/utils/db';
import Order from '@/models/Order';

type ApiResponse = {
  data: string;
}

interface Notification {
  order_number: string;
  carrier_name: string;
  carrier_service: string;
  shipment_date: string;
  tracking_number: string;
  tracking_status: string;
  last_updated_date: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>,
) {
  const { method } = req;

  try {
    await dbConnect();

    if (method === httpMethods.post) {
      const { order_number, tracking_number, tracking_status } = req.body as Notification;
      const exists = await Order.exists({ orderId: order_number });
      if (!exists) {
        res.status(400).json({ data: 'Invalid order number' });
        return;
      }
      await Order.findOneAndUpdate({ orderId: order_number }, {
        trackingNumber: tracking_number,
        status: tracking_status,
      });
      res.status(200).json({ data: 'Order updated successfully' });
    } else {
      console.warn(`There is no such handler for HTTP method: ${method}`);
      res.setHeader('Allow', [httpMethods.post]);
      res.status(405).json({ data: 'Method not allowed' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ data: 'Internal server error' });
  }
}
