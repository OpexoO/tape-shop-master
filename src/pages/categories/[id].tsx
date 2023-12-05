import { Product } from '@/interfaces/product/product';
import CategoryService from '@/services/category.service';
import ProductService from '@/services/product.service';
import dbConnect from '@/utils/db';
import { isValidObjectId } from 'mongoose';
import dynamic from 'next/dynamic';
import { GetServerSidePropsContext } from 'next';

export const getServerSideProps = async (
  { params, res }: { params: { id: string }, res: GetServerSidePropsContext['res'] },
) => {
  res.setHeader('Cache-Control', 's-maxage=3600, must-revalidate');
  await dbConnect();

  if (!isValidObjectId(params.id)) {
    return {
      notFound: true,
    };
  }

  const category = await CategoryService.getById(params.id);
  if (!category) {
    return {
      notFound: true,
    };
  }
  const products = ProductService.toPreview(
    await ProductService.getByCategoryId(params.id) as Product[],
  );

  return {
    props: {
      products: JSON.parse(JSON.stringify(products)),
      category: JSON.parse(JSON.stringify(category)),
    },
  };
};

const Category = dynamic(() => import('@/components/Category').then((mod) => mod.default));
export default Category;
