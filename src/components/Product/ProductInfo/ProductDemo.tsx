import { ProductItemDemo } from '@/interfaces/product/productDemo';
import styles from '@/styles/modules/Product.module.scss';
import LiteYouTubeEmbed from 'react-lite-youtube-embed';

export default function ProductDemo({ demo, productName }: { demo: ProductItemDemo, productName: string }) {
  if (!demo.video) {
    return null;
  }

  return (
    <section className={styles.productDemo}>
      <h3 className={`${styles.productInfoSubtitle} title`}>Demo video of the {productName}</h3>
      {!!demo.description && <p>{demo.description}</p>}
      <div className={`${styles.productVideo} ${styles.productVideoContainer}`}>
        <LiteYouTubeEmbed
          id="OBgRHfnl238"
          title={`Demo video of the ${productName}`}
          iframeClass={styles.productVideo}
          noCookie={true}
          aspectWidth={7}
          aspectHeight={4}
        />
      </div>
    </section>
  );
}
