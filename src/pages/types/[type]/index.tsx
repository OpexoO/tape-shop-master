import Head from 'next/head';
import { GetServerSidePropsContext } from 'next';
import styles from '@/styles/modules/Type.module.scss';
import dbConnect from '@/utils/db';
import TypeService from '@/services/type.service';
import { Type } from '@/interfaces/type';
import { Category } from '@/interfaces/category';
import ProductService from '@/services/product.service';
import LinkService from '@/services/link.service';
import CategoryCard from '@/components/CategoryCard';

export const getServerSideProps = async (
  { params, res }: { params: { type: string }, res: GetServerSidePropsContext['res'] },
) => {
  res.setHeader('Cache-Control', 's-maxage=3600, must-revalidate');
  await dbConnect();

  const type = await TypeService.findById(params.type);
  if (!type) {
    return {
      notFound: true,
    };
  }
  const products = await Promise.all(
    type.categories.map(({ _id }) => ProductService.getByTypeCategories(type._id, _id).count()),
  );
  const counts: Record<string, number> = products
    .reduce((acc: Record<string, number>, curr: number, idx: number) => ({
      ...acc,
      [type.categories[idx]._id]: curr,
    }), {});

  return {
    props: {
      type: JSON.parse(JSON.stringify(type)),
      counts: JSON.parse(JSON.stringify(counts)),
    },
  };
};

export default function Page({ type, counts }: { type: Type, counts: Record<string, number> }) {
  return (
    <>
      <Head>
        <title>{`${type.name} - QuiPtaping`}</title>
        <meta name="robots" content="index, follow" />
        <meta
          name="googlebot"
          content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
        />
        <meta
          name="bingbot"
          content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
        />
        <link rel="canonical" href={LinkService.typesLink(type.id)} />
        <meta property="canonical" content={LinkService.typesLink(type.id)} />
        <meta property="og:type" content="object" />
        <meta property="og:title" content={`${type.name} - QuiPtaping`} />
        <meta
          property="og:image"
          content={`${process.env.NEXT_PUBLIC_DOMAIN}/images/types/${type.id}.jpg`}
        />
        <meta
          property="og:image:secure_url"
          content={`${process.env.NEXT_PUBLIC_DOMAIN}/images/types/${type.id}.jpg`}
        />
        <meta property="og:image:alt" content={`QuiP ${type.id}`} />
        <meta name="twitter:title" content={`${type.name} - QuiPtaping`} />
        <meta
          name="twitter:image"
          content={`${process.env.NEXT_PUBLIC_DOMAIN}/images/types/${type.id}.jpg`}
        />
      </Head>
      <section className="container">
        <h1 className={`${styles.typeTitle} title centered`}>
          {type.name}
        </h1>

        <div className={styles.list}>
          {type.categories.map((c: Category) => (
            <CategoryCard key={c._id} item={c} typeName={type.id} counts={counts} />
          ))}
        </div>
      </section>
    </>
  );
}
