import Head from 'next/head';
import { GetServerSidePropsContext } from 'next';
import styles from '@/styles/modules/Webshop.module.scss';
import ProductsList from '@/components/ProductsList/ProductsList';
import ProductService from '@/services/product.service';
import { Product, ProductItemPreview } from '@/interfaces/product/product';
import dbConnect from '@/utils/db';
import LinkService from '@/services/link.service';

export const getServerSideProps = async ({ res }: GetServerSidePropsContext) => {
  res.setHeader('Cache-Control', 's-maxage=3600, must-revalidate');
  await dbConnect();

  const products = ProductService.toPreview(
    await ProductService.getAll() as Product[],
  );

  return {
    props: {
      products: JSON.parse(JSON.stringify(products)),
    },
  };
};

export default function Webshop({ products }: { products: ProductItemPreview[] }) {
  // const [sortedProducts, setSortedProducts] = useState<ProductItemPreview[]>(products);

  // const onSorting = (result: Product[]) => {
  //   setSortedProducts([...result]);
  // };

  return (
    <>
      <Head>
        <title>Shop - QuiPtaping</title>
        <meta
          name="description"
          content="Our products"
        />
        <meta name="dc.title" content="Shop - QuiPtaping" />
        <meta
          name="dc.description"
          content="Our products"
        />
        <meta name="dc.relation" content={LinkService.webshopLink()} />
        <meta name="robots" content="index, follow" />
        <meta
          name="googlebot"
          content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
        />
        <meta
          name="bingbot"
          content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
        />
        <link rel="canonical" href={LinkService.webshopLink()} />
        <meta property="og:url" content={LinkService.webshopLink()} />
        <meta property="og:title" content="Shop - QuiPtaping" />
        <meta
          property="og:description"
          content="Our products"
        />
        <meta name="twitter:title" content="Shop - QuiPtaping" />
        <meta
          name="twitter:description"
          content="Our products"
        />
      </Head>
      <section className="container">
        <h2 className={`${styles.productsTitle} title centered`}>Our products</h2>
        {/* {sortedProducts.length > 1
          && <div className={styles.productsSorting}>
            <Sorting value={sortedProducts} onChange={onSorting} />
          </div>
        } */}
        <ProductsList products={products} />
      </section>
    </>
  );
}
