import { ProductItemAdditional } from '@/interfaces/product/productAdditional';
import styles from '@/styles/modules/Product.module.scss';
import { removeSpaces } from '@/utils/helpers';

export default function ProductAdditionalInfo({ info }: { info: ProductItemAdditional[] }) {
  return (
    <table className={styles.additionalInfoTable}>
      <tbody>
        {info.map((i: ProductItemAdditional, idx: number) => (
          <tr className={styles.additionalInfoTableRow} key={`${removeSpaces(i.caption)}_${idx}`}>
            <th className={`${styles.additionalInfoTableTh} ${styles.additionalInfoTableEl}`}>{i.caption}</th>
            <td className={styles.additionalInfoTableEl}>{i.value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
