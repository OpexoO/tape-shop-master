import { GetServerSidePropsContext } from 'next';
import ProductsList from '@/components/ProductsList/ProductsList';
import productTypes from '@/constants/productTypes';
import { Product, ProductItemPreview } from '@/interfaces/product/product';
import ProductService from '@/services/product.service';
import TypeService from '@/services/type.service';
import dbConnect from '@/utils/db';
import Head from 'next/head';
import styles from '@/styles/modules/TypesPage.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import LinkService from '@/services/link.service';

export const getServerSideProps = async ({ res }: GetServerSidePropsContext) => {
  res.setHeader('Cache-Control', 's-maxage=3600, must-revalidate');
  await dbConnect();

  const type = await TypeService.findById(productTypes.Systainer);
  let products: ProductItemPreview[] = [];
  if (type) {
    products = ProductService.toPreview(
      await ProductService.getByTypeId(type._id) as Product[],
    ) as ProductItemPreview[];
  }

  return {
    props: {
      products: JSON.parse(JSON.stringify(products)),
    },
  };
};

export default function Systainer({ products }: { products: ProductItemPreview[] }) {
  return (
    <>
      <Head>
        <title>QuiP Systainer - QuiPtaping</title>
        <meta
          name="description"
          content="The QuiP Systainer with foam inlay for storage of Masking Dispenser and tape
          helps you to work organised, safe and efficient can be delivered in different versions."
        />
        <meta name="dc.title" content="QuiP Systainer - QuiPtaping" />
        <meta
          name="dc.description"
          content="The QuiP Systainer with foam inlay for storage of Masking Dispenser and tape
          helps you to work organised, safe and efficient can be delivered in different versions."
        />
        <meta name="dc.relation" content={LinkService.systainerLink()} />
        <meta name="robots" content="index, follow" />
        <meta
          name="googlebot"
          content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
        />
        <meta
          name="bingbot"
          content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
        />
        <link rel="canonical" href={LinkService.systainerLink()} />
        <meta property="og:url" content={LinkService.systainerLink()} />
        <meta property="og:title" content="QuiP Systainer - QuiPtaping" />
        <meta
          property="og:description"
          content="The QuiP Systainer with foam inlay for storage of Masking Dispenser and tape
          helps you to work organised, safe and efficient can be delivered in different versions."
        />
        <meta name="twitter:title" content="QuiP Systainer - QuiPtaping" />
        <meta
          name="twitter:description"
          content="The QuiP Systainer with foam inlay for storage of Masking Dispenser and tape
          helps you to work organised, safe and efficient can be delivered in different versions."
        />
      </Head>
      <div className="container">
        <section>
          <h1 className="title">QuiP Systainer</h1>
          <p>
            The QuiP Systainer with foam inlay for storage of Masking Dispenser and
            tape helps you to work organised, safe and efficient can be delivered in different versions.
          </p>
        </section>

        <section className={styles.systainerOptions}>
          <h3 className={`${styles.systainerOptionsTitle} title`}>Options:</h3>
          <ul className={styles.systainerOptionsList}>
            <li className={styles.systainerOptionsItem}>
              <FontAwesomeIcon className={styles.systainerOptionsIcon} icon={faCheck} />
              Systainer with a foam inlay to store handmasker and tape.
            </li>
            <li className={styles.systainerOptionsItem}>
              <FontAwesomeIcon className={styles.systainerOptionsIcon} icon={faCheck} />
              In the Systainer the capacity to store 8-12 rolls of tape and
              QuiP25 or QuiP38 Masking Dispenser for 25 and 38mm tapes
            </li>
            <li className={styles.systainerOptionsItem}>
              <FontAwesomeIcon className={styles.systainerOptionsIcon} icon={faCheck} />
              Systainer with foam inlay for both QuiP25 and QuiP38 Masking Dispensers
            </li>
          </ul>
        </section>

        {!!products.length
          && <article>
            <h2 className="title">Robust, connectable and transportable: work like a pro</h2>
            <ProductsList products={products} />
          </article>
        }
      </div>
    </>
  );
}
