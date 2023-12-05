import dynamic from 'next/dynamic';
import { GetServerSidePropsContext } from 'next';
import ProductService from '@/services/product.service';
import dbConnect from '@/utils/db';
import ReviewService from '@/services/review.service';
import { isValidObjectId } from 'mongoose';

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
  let product = await ProductService.getById(params.id);
  if (!product) {
    return {
      notFound: true,
    };
  }
  product = ProductService.toFullProduct(product);
  const relatedProducts = await Promise.all(
    product.related.map(ProductService.getById),
  );
  const reviews = ReviewService.fromServer(
    await ReviewService.getByProductId(product._id),
  );

  return {
    props: {
      product: JSON.parse(JSON.stringify(product)),
      reviews: JSON.parse(JSON.stringify(reviews)),
      relatedProducts: JSON.parse(JSON.stringify(ProductService.toPreview(relatedProducts))),
    },
  };
};

const Page = dynamic(() => import('@/components/Product/ProductPage').then((mod) => mod.default));
export default Page;
