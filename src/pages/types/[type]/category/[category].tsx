import { GetServerSidePropsContext } from 'next';
import ProductService from '@/services/product.service';
import TypeService from '@/services/type.service';
import { Category as ICategory } from '@/interfaces/category';
import CategoryList from '@/components/Category';
import dbConnect from '@/utils/db';

type Params = {
  type: string;
  category: string;
}

export const getServerSideProps = async (
  { params, res }: {params: Params, res: GetServerSidePropsContext['res']},
) => {
  res.setHeader('Cache-Control', 's-maxage=3600, must-revalidate');
  await dbConnect();

  const type = await TypeService.findById(params.type);
  if (!type) {
    return {
      notFound: true,
    };
  }
  const category = type.categories.find((c: ICategory) => c._id.toString() === params.category);
  if (!category) {
    return {
      notFound: true,
    };
  }
  const products = ProductService.toPreview(
    await ProductService.getByTypeCategories(type._id, params.category),
  );

  return {
    props: {
      products: JSON.parse(JSON.stringify(products)),
      category: JSON.parse(JSON.stringify(category)),
      typeId: type.id,
      typeName: type.name,
    },
  };
};

const TypeCategory = CategoryList;
export default TypeCategory;
