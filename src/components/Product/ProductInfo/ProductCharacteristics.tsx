import { ProductItemCharacteristics } from '@/interfaces/product/productCharacteristics';
import styles from '@/styles/modules/Product.module.scss';
import { removeSpaces } from '@/utils/helpers';

export default function ProductCharacteristics(
  { characteristics }: { characteristics: ProductItemCharacteristics },
) {
  return (
    <section className={styles.productInfoCharacteristics}>
      <h3 className={`${styles.productInfoSubtitle} title`}>Tape Dispenser characteristics:</h3>
      <ul className={styles.productInfoCharacteristicsList}>
        {characteristics.items.map((c: string, idx: number) => (
          <li key={`${removeSpaces(c)}_${idx}`} className={''}>
            {c}
          </li>
        ))}
      </ul>
      {!!characteristics.phrase
        && <p className={`${styles.productInfoCharacteristicsPhrase} bold`}>
          {characteristics.phrase}
        </p>
      }
    </section>
  );
}
