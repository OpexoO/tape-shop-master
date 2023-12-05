import Image from 'next/image';
import styles from '@/styles/modules/Product.module.scss';
import { removeSpaces } from '@/utils/helpers';
import { ProductItemFeatures } from '@/interfaces/product/productFeatures';

export default function ProductFeatures(
  { features, productName }: { features: ProductItemFeatures, productName: string },
) {
  if (!features.image && !features.features?.length) {
    return null;
  }

  return (
    <div className={styles.productFeatures}>
      {!!features.features?.length
        && <>
          <h3 className={`${styles.productInfoSubtitle} title`}>Why use a {productName}?</h3>
          {features.features.map((f: Record<string, string>, idx: number) => (
            <div key={`${removeSpaces(f.key)}_${idx}`} className={styles.productFeature}>
              <span className="bold">{f.key}: </span>
              {f.value}
            </div>
          ))}
        </>
      }
      {!!features.image
        && <Image
          className={styles.productInfoImg}
          src={features.image}
          alt={`${productName} features`}
          width={450}
          height={450}
          decoding="async"
          loading="lazy"
        />
      }
    </div>
  );
}
