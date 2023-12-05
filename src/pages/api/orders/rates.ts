import type { NextApiRequest, NextApiResponse } from 'next';
import fetch from 'node-fetch';
import httpMethods from '@/constants/httpMethods';
import { ShippingRatesResponse } from '@/interfaces/shippingRates';
import LinkService from '@/services/link.service';
import ShippingService from '@/services/shipping.service';

type Response = ShippingRatesResponse;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>,
) {
  const { method } = req;

  try {
    if (method === httpMethods.post) {
      const data = await fetch(LinkService.shippingRatesLink(), {
        headers: {
          ...ShippingService.prepareHeaders(),
          'Content-Type': 'application/json',
        },
        method: httpMethods.post,
        body: JSON.stringify(req.body),
      });
      const rates = await data.json() as Response;
      if (!data.ok) {
        throw new Error((rates as any).message);
      }
      res.status(200).json(rates);
    } else {
      console.warn(`There is no such handler for HTTP method: ${method}`);
      res.setHeader('Allow', [httpMethods.post]);
      res.status(405).json({
        rates: [],
        success: false,
        errors: [{ message: '', details: 'Method not allowed' }],
      });
    }
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      rates: [],
      success: false,
      errors: [{ message: '', details: 'Internal server error' }],
    });
  }
}
