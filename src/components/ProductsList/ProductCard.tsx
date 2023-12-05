import Link from 'next/link';
import Image from 'next/image';
import styles from '@/styles/modules/Webshop.module.scss';
import { MouseEvent } from 'react';
import { ProductItemPreview } from '@/interfaces/product/product';
import { formatPrice } from '@/utils/helpers';

export default function ProductCard(
  { product, categoryName, onAddToCart }:
    { product: ProductItemPreview, categoryName: string, onAddToCart: CallableFunction },
) {
  return (
    <Link className={styles.product} href={`/products/${product._id}`}>
      <Image
        className={styles.productImg}
        src={product.images[0]}
        alt={product.name}
        width={350}
        height={350}
        decoding="async"
        loading="lazy" />
      <div className={styles.productContent}>
        <span className={styles.productCaption}>{categoryName}</span>
        <h3 className={styles.productTitle}>{product.name}</h3>
        {/* <Rate isStatic={true} max={5} rating={product.rate} /> */}
        <span className={`${styles.productPrice} bold`}>$ {formatPrice(product.price)}</span>
        <button
          className={styles.productBtn}
          onClick={(e: MouseEvent) => onAddToCart(e, product)}>
          {product.withOptions ? 'Select options' : 'Add to cart'}
        </button>
      </div>
    </Link>
  );
}
