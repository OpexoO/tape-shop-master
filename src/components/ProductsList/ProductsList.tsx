import ProductCard from '@/components/ProductsList/ProductCard';
import { useCartContext } from '@/context/cartContext';
import { CartContextProps } from '@/interfaces/cart';
import { ProductItemPreview } from '@/interfaces/product/product';
import styles from '@/styles/modules/Webshop.module.scss';
import { useRouter } from 'next/router';
import { FunctionComponent, memo } from 'react';

interface Props {
  products: ProductItemPreview[];
  categoryName?: string;
  isMiniView?: boolean;
  isCentered?: boolean;
}

interface PropsWithContext extends Props {
  addItems: CartContextProps['addItems'];
}

const withContext = (Component: FunctionComponent<PropsWithContext>) => {
  const ComponentMemo = memo(Component);
  // eslint-disable-next-line react/display-name
  return (props: Props) => {
    const { addItems } = useCartContext();
    return <ComponentMemo {...props} addItems={addItems} />;
  };
};

const ProductsList = withContext((
  { products, categoryName, isMiniView, isCentered = true, addItems }: PropsWithContext,
) => {
  const { push } = useRouter();

  const addToCart = (e: MouseEvent, product: ProductItemPreview) => {
    e.preventDefault();

    if (product.withOptions) {
      push(`/products/${product._id}`);
      return;
    }
    addItems(product);
  };

  if (!products.length) {
    return <div>No products found</div>;
  }

  return (
    <div className={`
      ${styles.products} 
      ${styles[`products${products.length}`]}
      ${isMiniView ? styles.productsMini : ''}
      ${isCentered ? styles.productsCentered : ''}
    `}>
      {products.map((product: ProductItemPreview) => (
        <ProductCard
          onAddToCart={addToCart}
          categoryName={categoryName || product.categories[0].name}
          key={product._id}
          product={product}
        />
      ))}
    </div>
  );
});

export default ProductsList;
