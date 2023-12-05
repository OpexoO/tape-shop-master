import { ProductItemPreview } from '@/interfaces/product/product';
import styles from '@/styles/modules/Type.module.scss';
import { memo, useState } from 'react';
import Sorting from '@/components/ProductsSorting/ProductsSorting';
import Head from 'next/head';
import { Category } from '@/interfaces/category';
import LinkService from '@/services/link.service';
import ProductsList from './ProductsList/ProductsList';

interface Props {
  products: ProductItemPreview[];
  category: Category;
  typeId?: string;
  typeName?: string;
}

function CategoryListMemo({ products, category, typeId, typeName }: Props) {
  const [sortedProducts, setSortedProducts] = useState<ProductItemPreview[]>(products);

  const onSorting = (result: ProductItemPreview[]) => {
    setSortedProducts([...result]);
  };

  return (
    <>
      <Head>
        <title>{`${category.name} - QuiPtaping`}</title>
        <meta name="robots" content="index, follow" />
        <meta
          name="googlebot"
          content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
        />
        <meta
          name="bingbot"
          content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
        />
        {!!typeId
          && <>
            <link
              rel="canonical"
              href={LinkService.typeCategoryLink(typeId, category._id)}
            />
            <meta
              property="og:url"
              content={LinkService.typeCategoryLink(typeId, category._id)}
            />
          </>
        }
        {!typeId
          && <>
            <link
              rel="canonical"
              href={LinkService.categoryLink(category._id)}
            />
            <meta
              property="og:url"
              content={LinkService.categoryLink(category._id)}
            />
          </>
        }
        <meta property="og:type" content="object" />
        <meta property="og:title" content={`${category.name} - QuiPtaping`} />
        <meta property="og:description" content={`${category.name}${typeName ? ` ${typeName}` : ''}`} />
        <meta
          property="og:image"
          content={typeId
            ? `${process.env.NEXT_PUBLIC_DOMAIN}/images/types/${typeId}.jpg`
            : category.imageUrl
          }
        />
        <meta
          property="og:image:secure_url"
          content={typeId
            ? `${process.env.NEXT_PUBLIC_DOMAIN}/images/types/${typeId}.jpg`
            : category.imageUrl
          }
        />
        <meta property="og:image:alt" content={`${category.name}${typeName ? ` ${typeName}` : ''}`} />
        <meta name="twitter:title" content={`${category.name} - QuiPtaping`} />
        <meta name="twitter:description" content={`${category.name}${typeName ? ` ${typeName}` : ''}`} />
        <meta
          name="twitter:image"
          content={typeId
            ? `${process.env.NEXT_PUBLIC_DOMAIN}/images/types/${typeId}.jpg`
            : category.imageUrl
          }
        />
      </Head>
      <section className="container">
        <h1 className={`${styles.typeTitle} title centered`}>
          {category.name}
        </h1>
        {!!sortedProducts.length && <div className={styles.sortingBlock}>
          <div className={styles.sortingResult}>
            Showing {
              products.length > 1
                ? `all ${products.length} results`
                : 'the single result'
            }
          </div>
          {sortedProducts.length > 1 && <Sorting value={products} onChange={onSorting} />}
        </div>}
        <ProductsList isCentered={false} categoryName={category.name} products={sortedProducts} />
      </section>
    </>
  );
}

const CategoryList = memo(CategoryListMemo);
export default CategoryList;
