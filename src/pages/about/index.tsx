import Head from 'next/head';
import styles from '@/styles/modules/About.module.scss';
import ProductsCards from '@/components/ProductsCards/ProductsCards';
import dbConnect from '@/utils/db';
import TypeService from '@/services/type.service';
import { Type } from '@/interfaces/type';
import LiteYouTubeEmbed from 'react-lite-youtube-embed';
import LinkService from '@/services/link.service';
import { GetServerSidePropsContext } from 'next';

export async function getServerSideProps({ res }: GetServerSidePropsContext) {
  res.setHeader('Cache-Control', 's-maxage=3600, must-revalidate');
  await dbConnect();
  return {
    props: {
      types: JSON.parse(JSON.stringify(await TypeService.findAll())),
    },
  };
}

export default function About({ types }: { types: Type[] }) {
  return (
    <>
      <Head>
        <title>About QuiP - QuiPtaping</title>
        <meta
          name="description"
          content="Our passion for smart, functional and high-quality products with added value for
          professionals focuses on the construction, maintenance and renovation sectors
          and for the do-it-yourselfer."
        />
        <meta name="dc.title" content="About QuiP - QuiPtaping" />
        <meta
          name="dc.description"
          content="Our passion for smart, functional and high-quality products with added value for
          professionals focuses on the construction, maintenance and renovation sectors
          and for the do-it-yourselfer."
        />
        <meta name="dc.relation" content={LinkService.aboutLink()} />
        <link rel="canonical" href={LinkService.aboutLink()} />
        <meta property="og:url" content={LinkService.aboutLink()} />
        <meta property="og:title" content="About QuiP - QuiPtaping" />
        <meta
          property="og:description"
          content="Our passion for smart, functional and high-quality products with added value for
          professionals focuses on the construction, maintenance and renovation sectors
          and for the do-it-yourselfer."
        />
        <meta name="twitter:title" content="About QuiP - QuiPtaping" />
        <meta
          name="twitter:description"
          content="Our passion for smart, functional and high-quality products with added value for
          professionals focuses on the construction, maintenance and renovation sectors
          and for the do-it-yourselfer."
        />
        <meta name="robots" content="index, follow" />
        <meta
          name="googlebot"
          content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
        />
        <meta
          name="bingbot"
          content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
        />
      </Head>
      <div className="container">
        <div className={styles.about}>
          <section className={styles.aboutItem}>
            <h2 className="title">About QuiP</h2>
            <p className={styles.aboutText}>
              Our passion for smart, functional and high-quality products
              with added value for professionals focuses on the construction,
              maintenance and renovation sectors and for the do-it-yourselfer.
            </p>
            <p className={styles.aboutText}>
              Tape is there for a wide variety of applications.
              Tape is used in almost every industry worldwide.
              Think of building and construction, automotive, medical, maritime, aviation and much more.
              Finding the beginning of the tape, applying it accurately,
              cutting the tape to the right length is time-consuming and requires precision.
              Without tools you need both your hands and also a knife to cut the tape.
              In addition, tape quickly becomes unusable in dusty or humid spaces and drops.
            </p>
          </section>
          <div className={`${styles.video} ${styles.aboutItem}`}>
            <LiteYouTubeEmbed
              id="GRXPl5X2SHk"
              title="Masking Tape Dispenser - QuiPtaping (English)"
              iframeClass={styles.video}
              noCookie={true}
              aspectWidth={5}
              aspectHeight={3}
            />
          </div>
        </div>
        <p className={styles.aboutText}>
          The QuiP tape dispenser offers the solution so that you can always work neatly, quickly and easily.
          The Tape dispenser can be used for different applications
          with every tape and is supplied in the most common width sizes.
        </p>
        <p className={styles.aboutText}>
          Our technology and designs are patented and protected worldwide.
          Quality, speed of work, ease of use and simplicity are core values of the QuiP® brand.
          We focus on functional and high-quality products with added value for
          professionals in the construction, maintenance and renovation sectors.
        </p>
        <p className={styles.aboutText}>
          QuiPtaping is a brand of Mypro BV.
          Our products are marketed worldwide, including in Europe,
          North America, Canada, Mexico, Australia and New Zealand.
        </p>

        <ProductsCards types={types} />
      </div>
    </>
  );
}
