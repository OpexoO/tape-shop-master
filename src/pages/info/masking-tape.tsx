import { GetServerSidePropsContext } from 'next';
import productTypes from '@/constants/productTypes';
import { Product, ProductItemPreview } from '@/interfaces/product/product';
import ProductService from '@/services/product.service';
import TypeService from '@/services/type.service';
import dbConnect from '@/utils/db';
import Image from 'next/image';
import Head from 'next/head';
import styles from '@/styles/modules/TypesPage.module.scss';
import ProductsList from '@/components/ProductsList/ProductsList';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import { TapeDescription, tapesDescription } from '@/constants/tapes-descriptions';
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

export default function MaskingTape({ products }: { products: ProductItemPreview[] }) {
  return (
    <>
      <Head>
        <title>Masking tape - QuiPtaping</title>
        <meta
          name="description"
          content="QuiPtaping has suitable masking tape for every surface.
          This way, you have the best adhesion depending on the surface to be processed."
        />
        <meta name="dc.title" content="Masking tape - QuiPtaping" />
        <meta
          name="dc.description"
          content="QuiPtaping has suitable masking tape for every surface.
          This way, you have the best adhesion depending on the surface to be processed."
        />
        <meta name="dc.relation" content={LinkService.maskingTapeLink()} />
        <meta name="robots" content="index, follow" />
        <meta
          name="googlebot"
          content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
        />
        <meta
          name="bingbot"
          content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
        />
        <link rel="canonical" href={LinkService.maskingTapeLink()} />
        <meta property="og:url" content={LinkService.maskingTapeLink()} />
        <meta property="og:title" content="Masking tape - QuiPtaping" />
        <meta
          property="og:description"
          content="QuiPtaping has suitable masking tape for every surface.
          This way, you have the best adhesion depending on the surface to be processed."
        />
        <meta
          property="og:image"
          content={`${process.env.NEXT_PUBLIC_DOMAIN}/images/types/masking-tape.png`}
        />
        <meta
          property="og:image:secure_url"
          content={`${process.env.NEXT_PUBLIC_DOMAIN}/images/types/masking-tape.png`}
        />
        <meta property="og:image:alt" content="All Masking Tape QuiP" />
        <meta name="twitter:title" content="Masking tape - QuiPtaping" />
        <meta
          name="twitter:image"
          content={`${process.env.NEXT_PUBLIC_DOMAIN}/images/types/masking-tape.png`}
        />
        <meta
          name="twitter:description"
          content="QuiPtaping has suitable masking tape for every surface.
          This way, you have the best adhesion depending on the surface to be processed."
        />
      </Head>
      <div className={`${styles.dispenser} container`}>
        <div className={`${styles.dispenserBlock} ${styles.dispenserBlockMobile}`}>
          <Image
            className={styles.dispenserImg}
            src="/images/types/masking-tape.png"
            alt="All Masking Tape QuiP"
            width={580}
            height={580}
            decoding="async"
            priority
          />
          <section className={styles.dispenserItem}>
            <h1 className={`${styles.dispenserTitle} title`}>QuiP Masking Tape</h1>
            <p>
              Our masking tape is produced from rice paper, ultra thin, strong and UV resistant.
              Solvents and water based paints do not get a chance to come under the tape.
              Sharp painting lines are the result when removing the tape after the paint is dry.
              And QuiP® tape does not leave any residue.
            </p>
          </section>
        </div>

        {tapesDescription.map((t: TapeDescription, idx: number) => {
          const product = products.find((p: ProductItemPreview) => p._id === t.id);
          if (!product) {
            return null;
          }

          const image = product.images[0];
          return (
            <div
              key={t.id}
              className={
                `${styles.dispenserBlock}
                ${styles.dispenserBlockMobile}
                ${idx % 2 ? styles.dispenserBlockReverse : ''}`
              }
            >
              <section className={`${styles.dispenserItem} ${styles.typeItemMobile}`}>
                <h2 className={`${styles.systainerOptionsTitle} title`}>
                  {t.title}
                </h2>
                <p>{t.description}</p>
                <ul className={styles.tapeList}>
                  {t.materials.map((value: string, idx: number) => (
                    <li className={styles.tapeListItem} key={`${value}_${idx}`}>
                      <FontAwesomeIcon className={styles.tapeListIcon} icon={faCheck} />
                      {value}
                    </li>
                  ))}
                </ul>
                <Link className={styles.tapeBtn} href={`/products/${t.id}`}>
                  Order Now
                </Link>
              </section>
              <Image
                className={styles.dispenserImg}
                src={image}
                alt={t.title}
                priority
                width={580}
                height={580}
              />
            </div>
          );
        })}

        {!!products.length
          && <section className={styles.dispenserOrder}>
            <h2 className={`${styles.dispenserTitle} title`}>Order now</h2>
            <p className={styles.dispenserOrderText}>Take the hassle out of your painting job.</p>

            <ProductsList products={products} />
          </section>
        }
      </div >
    </>
  );
}
