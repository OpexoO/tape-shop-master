import { GetServerSidePropsContext } from 'next';
import ProductsList from '@/components/ProductsList/ProductsList';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import styles from '@/styles/modules/TypesPage.module.scss';
import TypeService from '@/services/type.service';
import productTypes from '@/constants/productTypes';
import ProductService from '@/services/product.service';
import { Product, ProductItemPreview } from '@/interfaces/product/product';
import dbConnect from '@/utils/db';
import LiteYouTubeEmbed from 'react-lite-youtube-embed';
import LinkService from '@/services/link.service';

export const getServerSideProps = async ({ res }: GetServerSidePropsContext) => {
  res.setHeader('Cache-Control', 's-maxage=3600, must-revalidate');
  await dbConnect();

  const type = await TypeService.findById(productTypes.TapeDispensers);
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

export default function TapeDispenser({ products }: { products: ProductItemPreview[] }) {
  return (
    <>
      <Head>
        <title>Quip Masking Tape Dispenser - QuiPtaping</title>
        <meta
          name="description"
          content="Applying tape with the QuiP Masking Tape Dispenser enables you to work fast and precise!
          You want to achieve straight and sharp painting lines."
        />
        <meta name="dc.title" content="Quip Masking Tape Dispenser - QuiPtaping" />
        <meta
          name="dc.description"
          content="Applying tape with the QuiP Masking Tape Dispenser enables you to work fast and precise!
          You want to achieve straight and sharp painting lines."
        />
        <meta name="dc.relation" content={LinkService.dispensersLink()} />
        <meta name="robots" content="index, follow" />
        <meta
          name="googlebot"
          content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
        />
        <meta
          name="bingbot"
          content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
        />
        <link rel="canonical" href={LinkService.dispensersLink()} />
        <meta property="og:url" content={LinkService.dispensersLink()} />
        <meta property="og:title" content="Quip Masking Tape Dispenser - QuiPtaping" />
        <meta
          property="og:description"
          content="Applying tape with the QuiP Masking Tape Dispenser enables you to work fast and precise!
          You want to achieve straight and sharp painting lines."
        />
        <meta
          property="og:image"
          content={`${process.env.NEXT_PUBLIC_DOMAIN}/images/info/dispenser/all.png`}
        />
        <meta
          property="og:image:secure_url"
          content={`${process.env.NEXT_PUBLIC_DOMAIN}/images/info/dispenser/all.png`}
        />
        <meta property="og:image:alt" content="All the quip masking tape dispenser" />
        <meta name="twitter:title" content="Quip Masking Tape Dispenser - QuiPtaping" />
        <meta
          name="twitter:description"
          content="Applying tape with the QuiP Masking Tape Dispenser enables you to work fast and precise!
          You want to achieve straight and sharp painting lines."
        />
        <meta
          name="twitter:image"
          content={`${process.env.NEXT_PUBLIC_DOMAIN}/images/info/dispenser/all.png`}
        />
      </Head>
      <div className={`${styles.dispenser} container`}>
        <div className={`${styles.dispenserBlock} ${styles.dispenserBlockMobile}`}>
          <Image
            className={styles.dispenserImg}
            src="/images/info/dispenser/all.png"
            alt="All the quip masking tape dispenser"
            width={580}
            height={580}
            decoding="async"
            priority
          />
          <section className={styles.dispenserItem}>
            <h1 className={`${styles.dispenserTitle} title`}>QuiP Tape Dispenser</h1>
            <p>
              Applying tape with the QuiP Tape Dispenser enables you to work fast and precise!
              You want to achieve straight and sharp painting lines by the end of the day.
              Saves you time and money.
            </p>
          </section>
        </div>

        <div className={styles.dispenserBlock}>
          <section className={styles.dispenserItem}>
            <h2 className="title">Apply masking tape accurate and straight</h2>
            <p className={styles.dispenserIndent}>
              With the unique QuiP Handmasker you are able to apply tape accurately in straight lines,
              and you will be able to apply and cut the tape precisely in the corner.
              An improvement of your performance and improvement of the final result!
            </p>
            <p>
              QuiP® Handmasker has some very useful features;
              first of all you always have the beginning of the tape direct at hand.
              Secondly the tool can be operated single handed.
              Thirdly the cutting mechanism cuts the tape and the shape of the dispenser enables you
              to cut precisely at the right length.
              Furthermore a cover protects the tape so dust,
              dirt and moisture do not have a chance to influence the tape quality.
              And most important: sharp painting lines is the perfect result!
            </p>
          </section>
          <Image
            className={styles.dispenserImg}
            src="/images/info/dispenser/advantage.png"
            alt="advantage of the QuiP masking tape dispenser"
            decoding="async"
            loading="lazy"
            width={580}
            height={580}
          />
        </div>

        <div className={`${styles.dispenserBlock} ${styles.dispenserBlockMobile}`}>
          <Image
            className={styles.dispenserImg}
            src="/images/info/dispenser/benefits.png"
            alt="Benefits QuiP masking tape dispenser"
            decoding="async"
            loading="lazy"
            width={580}
            height={580}
          />
          <div className={styles.dispenserItem}>
            <section>
              <h2 className="title">Masking Tape Dispenser Features</h2>
              <p>QuiP Masking tape Dispensers have some very useful features</p>
            </section>

            <section className={styles.dispenserSection}>
              <h3 className={`${styles.dispenserSectionTitle} title`}>Universal coil</h3>
              <p>
                The QuiP tape dispenser has a universal coil.
                This means that the spool fits all types of masking tape in the tape dispenser.
                This is ideal if you don’t have QuiP masking tape at your disposal for a while or
                would like to use other tape. In addition, the coil may need to be tightened.
                Ideal for masking tape with a lower tack to control the speed of application of the tape.
              </p>
            </section>

            <section className={styles.dispenserSection}>
              <h3 className={`${styles.dispenserSectionTitle} title`}>Rollers</h3>
              <p>
                The rollers on the tape dispenser ensure that the masking tape adheres well to the surface.
              </p>
            </section>
          </div>
        </div>

        <div className={styles.dispenserBlock}>
          <div className={styles.dispenserItem}>
            <section>
              <h2 className="title">Demo of the QuiP Tape dispenser</h2>
              <p>
                To get an idea of all these advantages.
                QuiPtaping has prepared a product demonstration video for you.
                You can get an even better picture of this masking tape dispenser.
              </p>
            </section>
            <section className={styles.dispenserSection}>
              <h3 className={`${styles.dispenserSectionTitle} title`}>Tape dispenser bandwidths</h3>
              <p>
                QuiPtaping makes it possible to apply accurate and straight.
                Therefore we offer tape dispensers for various bandwidths:
                <Link href="/">QuiP 25</Link>, <Link href="/">QuiP 36</Link>,
                and <Link href="/">QuiP38</Link>.
                Except the tape bandwidth the functionality and design is the same.
                The number after the knife sign and QuiP.xx indicates the maximum tape width in millimeters.
              </p>
            </section>
          </div>
          <div className={`${styles.dispenserVideo} ${styles.dispenserVideoContainer}`}>
            <LiteYouTubeEmbed
              id="bh2vlymVoyU"
              title="Demo and Details of the Quip Tape Dispenser & Systainer - QuiPtaping"
              iframeClass={styles.dispenserVideo}
              noCookie={true}
              aspectWidth={7}
              aspectHeight={4}
            />
          </div>
        </div>

        {!!products.length
          && <section className={styles.dispenserOrder}>
            <h2 className={`${styles.dispenserTitle} title`}>Order now</h2>
            <p className={styles.dispenserOrderText}>Take the hassle out of your painting job.</p>

            <ProductsList products={products} />
          </section>
        }
      </div>
    </>
  );
}
