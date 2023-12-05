import styles from '@/styles/modules/ProductsCards.module.scss';
import Link from 'next/link';
import { ProductTypeCard } from '@/interfaces/productTypeCard';
import { Type } from '@/interfaces/type';
import { memo } from 'react';
import getCardsText from './cards';

function ProductsCardsMemo(
  { isHomePage = false, types }: { isHomePage?: boolean, types: Type[] },
) {
  const getCards = (): ProductTypeCard[] => {
    const cardsText = getCardsText(isHomePage);
    return types.map((t: Type) => ({
      id: t.id,
      title: t.name,
      text: cardsText.find((c: Partial<ProductTypeCard>) => c.id === t.id)?.text || '',
    }));
  };

  return (
    <section className={styles.aboutProducts}>
      <h2 className={`${isHomePage ? styles.productsTitle : ''} title centered`}>Our products</h2>
      <div className={styles.products}>
        {getCards().map((card: ProductTypeCard) => (
          <Link key={card.id} href={`/info/${card.id}`} className={styles.productCardContainer}>
            <div
              className={styles.productImg}
              style={{ backgroundImage: `url(/images/types/${card.id}.jpg)` }}></div>
            <div className={styles.productCard}>
              <h3 className={styles.productTitle}>
                {card.title}
              </h3>
              <p>{card.text}</p>
            </div>
          </Link>
        ))}

        {/* TODO: For test purposes. Choose one of the styles and uncomment code in cards.ts  */}
        {/* <div className={`${styles.productCardContainer} ${styles.noShadow}`}>
          <div className={`${styles.productImg} ${styles.productImgTest} ${styles.maskingtapeImg}`}>
            <div className={styles.overlay}></div>
          </div>
          <div className={styles.productCard}>
            <h3 className={styles.productTitle}>Masking tape</h3>
            <p>
              Sharp painting lines and no residue are the result
              when removing the QuiP maskingtape after the paint is dry.
            </p>
            <Link href="/" className={styles.productBtn}>Read more</Link>
          </div>
        </div> */}
      </div>
    </section>
  );
}

const ProductsCards = memo(ProductsCardsMemo);
export default ProductsCards;
