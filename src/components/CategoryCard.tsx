import { memo } from 'react';
import styles from '@/styles/modules/Type.module.scss';
import Link from 'next/link';
import Image from 'next/image';
import { Category } from '@/interfaces/category';

interface Props {
  item: Category;
  typeName: string;
  counts: Record<string, number>;
}

function CategoryCard({ item, typeName, counts }: Props) {
  const categoryId = item._id;

  return (
    <Link href={`/types/${typeName}/category/${categoryId}`} className={styles.categoryCard}>
      <Image
        className={styles.categoryCardImg}
        src={item.imageUrl}
        alt={item.name}
        width={300}
        height={300}
        priority
        decoding="async"
      />
      <div>
        <h3 className={styles.categoryCardTitle}>{item.name}</h3>
        <p className={styles.categoryCardCaption}>
          {
            counts[categoryId] > 1
              ? `${counts[categoryId]} products`
              : `${counts[categoryId]} product`
          }
        </p>
      </div>
    </Link>
  );
}

export default memo(CategoryCard);
