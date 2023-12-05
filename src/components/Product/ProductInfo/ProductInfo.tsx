import { Product } from '@/interfaces/product/product';
import styles from '@/styles/modules/Product.module.scss';
import { isProductItemDemo } from '@/interfaces/product/productDemo';
import { isProductItemFeatures } from '@/interfaces/product/productFeatures';
import ProductCharacteristics from './ProductCharacteristics';
import ProductFeatures from './ProductFeatures';
import ProductDemo from './ProductDemo';

export default function ProductInfo({ product }: { product: Product }) {
  return (
    <article>
      <h2 className={`${styles.productInfoTitle} title`}>{product.name}</h2>
      <p className={styles.productDescription}>{product.description}</p>
      <ProductCharacteristics characteristics={product.characteristics} />
      {isProductItemFeatures(product.features)
        && <ProductFeatures features={product.features} productName={product.name} />}
      {isProductItemDemo(product.demo)
        && <ProductDemo demo={product.demo} productName={product.name} />}
    </article>
  );
}
