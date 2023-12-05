import Head from 'next/head';
import styles from '@/styles/modules/Product.module.scss';
import Tabs from '@/components/Tabs';
import { Tab } from '@/interfaces/tabs';
import { Product, ProductItemPreview } from '@/interfaces/product/product';
import ProductInfo from '@/components/Product/ProductInfo/ProductInfo';
import ProductsList from '@/components/ProductsList/ProductsList';
import { Review } from '@/interfaces/review';
import ProductAdditionalInfo from '@/components/Product/ProductAdditionalInfo';
import LinkService from '@/services/link.service';
import { useCallback, useMemo } from 'react';
import ProductHeader from '@/components/Product/ProductHeader';
import Reviews from '@/components/Product/Reviews/Reviews';
import { productJsonLs } from '@/utils/jsonLd';

export default function ProductPage(
  { product, relatedProducts, reviews }:
    { product: Product, relatedProducts: ProductItemPreview[], reviews: Review[] },
) {
  const onReviewAdded = useCallback((r: Review) => reviews.push(r), [reviews]);
  const tabs: Tab[] = useMemo(
    () => generateTabs(product, reviews, onReviewAdded),
    [product, reviews, onReviewAdded],
  );

  return (
    <>
      <Head>
        <title>{`${product.name} - QuiPtaping`}</title>
        <meta
          name="description"
          content={product.description}
        />
        <meta property="product:price:amount" content={product.price.toString()} />
        <meta property="product:price:currency" content="USD" />
        <meta name="dc.title" content={`${product.name} - QuiPtaping`} />
        <meta
          name="dc.description"
          content={product.description}
        />
        <meta name="dc.relation" content={LinkService.productLink(product._id)} />
        <meta name="robots" content="index, follow" />
        <meta
          name="googlebot"
          content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
        />
        <meta
          name="bingbot"
          content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
        />
        <link rel="canonical" href={LinkService.productLink(product._id)} />
        <meta property="og:url" content={LinkService.productLink(product._id)} />
        <meta property="og:type" content="og:product" />
        <meta property="og:title" content={`${product.name} - QuiPtaping`} />
        <meta
          property="og:description"
          content={product.description}
        />
        <meta
          property="og:image"
          content={product.images[0]}
        />
        <meta
          property="og:image:secure_url"
          content={product.images[0]}
        />
        <meta property="og:image:alt" content="QuiP36 masking tape dispenser with pink masking tape" />
        <meta name="twitter:title" content={`${product.name} - QuiPtaping`} />
        <meta
          name="twitter:description"
          content={product.description}
        />
        <meta
          property="twitter:image"
          content={product.images[0]}
        />
        <script type="application/ld+json" dangerouslySetInnerHTML={productJsonLs(product)} />
      </Head>

      <div className={`${styles.productContainer} container`}>
        <ProductHeader product={product} />

        <div className={styles.productMain}>
          <div className={styles.productContent}>
            <Tabs tabs={tabs} />
          </div>

          {!!relatedProducts.length
            && <aside className={styles.productRelated}>
              <h2 className={`${styles.productInfoTitle} title`}>Related products</h2>
              <ProductsList products={relatedProducts} isCentered={false} isMiniView={true} />
            </aside>
          }
        </div>
      </div>
    </>
  );
}

function generateTabs(product: Product, reviews: Review[], onReviewAdded: CallableFunction) {
  const approved = reviews.filter((r: Review) => r.isApproved && r.isChecked);

  const tabs: Tab[] = [];
  tabs.push({
    id: 'descriptionTab',
    text: 'Description',
    content: () => <ProductInfo product={product} />,
  });

  if (product.additionalInformation?.length) {
    tabs.push({
      id: 'additionalInfoTab',
      text: 'Additional information',
      content: () => <ProductAdditionalInfo info={product.additionalInformation!} />,
    });
  }

  tabs.push({
    id: 'reviewsTab',
    text: `Reviews (${approved.length})`,
    content: () => <Reviews
      fetchedReviews={reviews}
      productId={product._id}
      productName={product.name}
      onReviewAdded={onReviewAdded}
    />,
  });
  return tabs;
}
