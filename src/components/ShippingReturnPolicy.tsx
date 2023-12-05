import Head from 'next/head';
import styles from '@/styles/modules/Policy.module.scss';
import LinkService from '@/services/link.service';

export default function ShippingReturnPolicy() {
  return (
    <>
      <Head>
        <title>Shipping & Return Policy - QuiPtaping</title>
        <meta
          name="description"
          content="When you want to return something from QuiPtaping.
          It is useful to check our return conditions in advance."
        />
        <meta name="dc.title" content="Shipping & Return Policy - QuiPtaping" />
        <meta
          name="dc.description"
          content="When you want to return something from QuiPtaping.
          It is useful to check our return conditions in advance."
        />
        <meta name="dc.relation" content={LinkService.returnPolicyLink()} />
        <meta name="robots" content="index, follow" />
        <meta
          name="googlebot"
          content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
        />
        <meta
          name="bingbot"
          content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
        />
        <link rel="canonical" href={LinkService.returnPolicyLink()} />
        <meta property="og:url" content={LinkService.returnPolicyLink()} />
        <meta property="og:title" content="Shipping & Return Policy - QuiPtaping" />
        <meta
          property="og:description"
          content="When you want to return something from QuiPtaping.
          It is useful to check our return conditions in advance."
        />
        <meta name="twitter:title" content="Shipping & Return Policy - QuiPtaping" />
        <meta
          name="twitter:description"
          content="When you want to return something from QuiPtaping.
          It is useful to check our return conditions in advance."
        />
      </Head>
      <section className="container">
        <h1 className={`title ${styles.policyTitle}`}>Shipping & Return policy</h1>

        <div className={styles.policyBlock}>
          <h2 className={`${styles.shippingTitle} title`}>Shipping policy</h2>
          <ol>
            <li className={styles.listItem}>
              Payment has to be done in advance.
            </li>
            <li className={styles.listItem}>
              The order will be shipped in normal conditions within 3 working days
              after payment is received. The risk of shipment is for the customer.
            </li>
            <li className={styles.listItem}>
              Cost of shipping is depending on order volume, the weight and size of the package.
            </li>
            <li className={styles.listItem}>
              Check before sending your order if the order form is filled in correct.
              AMS will send your order to the address filled out by the customer
              and is not responsible when address information is incorrect.
            </li>
          </ol>
        </div>

        <div className={styles.policyBlock}>
          <h2 className={`${styles.shippingTitle} title`}>Delivery of the articles</h2>
          <ol>
            <li className={styles.listItem}>
              The order will be prepared and sent as soon as payment is received.
              The date of payment is the date of credit the payment is received into our account.
            </li>
            <li className={styles.listItem}>
              Sending the order usually takes place within 1 to 3 working days after receiving the payment.
              Exceptions are possible and depend on availability of the article.
              AMS is not responsible for delays if there are circumstances out of our control
              When delivery is delayed because of AMS the customer will be contacted.
            </li>
            <li className={styles.listItem}>
              The customer has ownership of the articles after they are paid.
              The risk of the purchase starts for the customer, from the moment of delivery.
              Delivery is “when it leaves our distribution centres”.
            </li>
          </ol>
        </div>

        <div className={styles.policyBlock}>
          <h2 className={`${styles.shippingTitle} title`}>Delivery time</h2>
          <p>
            We rely on the delivery company to get your order to you in good time.
            Depending on your location we would expect between 2-10 days.
          </p>
        </div>

        <div className={styles.policyBlock}>
          <h2 className={`${styles.shippingTitle} title`}>Return policy</h2>
          <p className={styles.policyIndent}>
            If the product is faulty, we will gladly replace the item.
            Please return the unit in its original packaging postpaid to the following address:
          </p>

          <div className={`${styles.policyIndent} ${styles.shippingAddressBlock}`}>
            <div className={styles.shippingAddress}>
              <div className="bold">In New Zealand</div>
              <div>AMS</div>
              <div>
                76A Hinemoa street, North Ward
              </div>
              <div>Whakatane</div>
              <div>3120</div>
              <div>New Zealand</div>
            </div>

            <div className={styles.shippingAddress}>
              <div className="bold">In  Australia</div>
              <div>AMS</div>
              <div>1/128 Eyre st</div>
              <div>Townsville</div>
              <div>QLD 4810</div>
              <div>Australia</div>
            </div>
          </div>

          <p>
            Please state your full name and return address including the date you received the unit.
            After inspection you will have the option to a full
            refund of the original purchase price or a replacement.
            However, if the unit has been damaged we reserve the right to decline a replacement at no cost.
          </p>
        </div>
      </section>
    </>
  );
}
