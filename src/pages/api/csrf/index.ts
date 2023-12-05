import type { NextApiRequest, NextApiResponse } from 'next';
import httpMethods from '@/constants/httpMethods';
import { csrfCookieToken } from '@/constants/csrf';

type Response = {
  data: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>,
) {
  const { method, cookies } = req;

  try {
    if (method === httpMethods.get) {
      res.status(200).json({ data: cookies[csrfCookieToken] || '' });
    } else {
      console.warn(`There is no such handler for HTTP method: ${method}`);
      res.setHeader('Allow', [httpMethods.get]);
      res.status(405).json({ data: 'Method not allowed' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ data: 'Internal server error' });
  }
}
