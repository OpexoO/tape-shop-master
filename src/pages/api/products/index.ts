import type { NextApiRequest, NextApiResponse } from 'next';
import httpMethods from '@/constants/httpMethods';
import Product from '@/models/Product';
import dbConnect from '@/utils/db';
import ProductService from '@/services/product.service';
import { Product as IProduct, ProductItem } from '@/interfaces/product/product';
import HashHandlerService from '@/services/hash.service';
import itemsPerPage from '@/constants/perPage';
import { Query, SortOrder, isValidObjectId } from 'mongoose';
import sortingValue from '@/constants/sortingValues';

type Response = {
  data: string | ProductItem | IProduct | IProduct[];
  total?: number;
};

const buildQuery = (params: NextApiRequest['query']) => {
  const {
    excludeOne, name, stock, stockGt, stockLt, sku,
    priceGt, priceLt, priceLte, priceGte, type, categories,
    sort, sortField,
  } = params;

  let query: Query<ProductItem[], ProductItem>;
  const filters: any = {};
  const stockFilter: any = {};
  const priceFilter: any = {};
  if (stock) {
    filters.availability = stock === 'null' ? null : 0;
  }
  if (stockGt) {
    stockFilter.$gt = +stockGt;
  }
  if (stockLt) {
    stockFilter.$lt = +stockLt;
  }
  if (stockFilter.$gt || stockFilter.$lt) {
    filters.availability = stockFilter;
  }
  if (priceGt) {
    priceFilter.$gt = +priceGt;
  }
  if (priceLt) {
    priceFilter.$lt = +priceLt;
  }
  if (priceGte) {
    priceFilter.$gte = +priceGte;
  }
  if (priceLte) {
    priceFilter.$lte = +priceLte;
  }
  if (priceFilter.$gt || priceFilter.$gte || priceFilter.$lt || priceFilter.$lte) {
    filters.price = priceFilter;
  }
  if (excludeOne && isValidObjectId(excludeOne)) {
    filters._id = { $ne: excludeOne };
  }
  if (name) {
    filters.name = { $regex: new RegExp(name as string, 'ig') };
  }
  if (sku) {
    filters.sku = { $regex: new RegExp(sku as string, 'ig') };
  }
  if (type) {
    filters.productType = type;
  }
  if (categories) {
    filters.categories = { $all: JSON.parse(categories as string) };
  }
  query = Product.find(filters);

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
    await dbConnect();

    if (method === httpMethods.get) {
      const page = +(req.query.page || 1);
      const limit = page > 0 ? +(req.query.perPage || itemsPerPage.categories) : 0;
      let toSkip: number = 0;
      if (page > 0) {
        toSkip = (page - 1) * limit;
      }

      const data = ProductService.toFullProduct(
        await buildQuery(req.query)
          .skip(toSkip)
          .limit(limit)
          .populate(['categories', 'productType'])
          .exec(),
      );
      const total = await Product.count();
      res.status(200).json({ data, total });
    } else if (method === httpMethods.post) {
      const verify = await HashHandlerService.verifyAdminToken(req.headers.authorization);
      if (!verify) {
        res.status(401).json({ data: 'Invalid access token or role' });
        return;
      }

      const preparedFields = ProductService.prepareFields(req.body);
      const validation = ProductService.validate(preparedFields);
      if (typeof validation === 'string') {
        res.status(400).json({ data: validation });
        return;
      }

      const newProduct = await Product.create(
        ProductService.toServer(preparedFields),
      );
      res.status(201).json({ data: ProductService.fromServer(newProduct) as ProductItem });
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
