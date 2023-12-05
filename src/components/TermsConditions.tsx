import Head from 'next/head';
import styles from '@/styles/modules/Policy.module.scss';
import LinkService from '@/services/link.service';

export default function TermsCondiitons() {
  return (
    <>
      <Head>
        <title>Terms & Conditions - QuiPtaping</title>
        <meta
          name="description"
          content="Terms & Conditions - QuiPtaping"
        />
        <meta name="dc.title" content="Terms & Conditions - QuiPtaping" />
        <meta
          name="dc.description"
          content="Terms & Conditions - QuiPtaping"
        />
        <meta name="dc.relation" content={LinkService.tcLink()} />
        <meta name="robots" content="index, follow" />
        <meta
          name="googlebot"
          content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
        />
        <meta
          name="bingbot"
          content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
        />
        <link rel="canonical" href={LinkService.tcLink()} />
        <meta property="og:url" content={LinkService.tcLink()} />
        <meta property="og:title" content="Terms & Conditions - QuiPtaping" />
        <meta
          property="og:description"
          content="Terms & Conditions - QuiPtaping"
        />
        <meta name="twitter:title" content="Terms & Conditions - QuiPtaping" />
        <meta
          name="twitter:description"
          content="Terms & Conditions - QuiPtaping"
        />
      </Head>
      <section className="container">
        <h1 className={`title ${styles.policyTitle}`}>Terms & Conditions</h1>

        <p className={styles.policyIndent}>Welcome dear customer,</p>
        <p>
          We appreciate your confidence in our company.
          We want to maintain an excellent relationship with our customers. Both parties trust is essential.
          We take your rights seriously and do all we can to offer
          the best quality, service and price for you.
          It is important for you to be informed and that you know what you can expect of us.
          The conditions below give you the possibility to be informed in detail
          when you like to order via our web shop.If you surf in our site you accept and respect our rules,
          conditions and copyright for the use of the site and the products in our webshop.
          AMS will do business with you in an honest way.
        </p>
        <p className={styles.policyIndent}>Articles we can offer:</p>
        <p className={styles.policyIndent}>
          AMS will have all articles in store to be able to deliver immediately
          after your order and payment is received.
          It is possible some articles are temporary or permanent sold out or not available any longer.
          AMS cannot be held responsible for late or non delivery of an article.
        </p>

        <div className={styles.policyBlock}>
          <h3 className={styles.policyBlockTitle}>Article 1 Suitability</h3>
          <ul>
            <li>
              1.1 On all articles and valid delivery contracts of
              AMS our General Terms and Conditions are applicable.
            </li>
            <li>
              1.2 Acceptation of our product offers, or when you place an order,
              you accept and understand our terms for delivery.
            </li>
            <li>
              1.7 AMS has the right to cancel any order without explanation,
              if the order form is not filled in complete or for other urgent reasons.
            </li>
          </ul>
        </div>

        <div className={styles.policyBlock}>
          <h3 className={styles.policyBlockTitle}>Article 2 Price of articles</h3>
          <ul>
            <li>
              2.1 All articles offered by AMS are free of obligations.
              We keep the right to change the prices of articles or to stop selling it.
            </li>
            <li>
              2.2 The prices in the webshop are in AU or NZ dollar depending from which country you reside.
              <br />– In the webshop all prices are inclusive of the current Tax (GST).
            </li>
            <li>
              2.3 Prices are exclusive cost of shipment and costs of payment.
            </li>
          </ul>
        </div>

        <div className={styles.policyBlock}>
          <h3 className={styles.policyBlockTitle}>Article 3 How to order</h3>
          <ul>
            <li>
              3.1 Payment has to be done in advance.
            </li>
            <li>
              3.2 The order will be shipped in normal conditions within 3 working days after
              payment is received.The risk of shipment is for the customer.
            </li>
            <li>
              3.3 Cost of shipment is dependant on order volume, the weight and size of the package.
            </li>
            <li>
              3.5 Check before sending your order if the order form is filled in correctly.
              AMS will sent your order to address filled out by the customer and is not responsible
              when address information is incorrect.
            </li>
          </ul>
        </div>

        <div className={styles.policyBlock}>
          <h3 className={styles.policyBlockTitle}>Article 4 Payments</h3>
          <ul>
            <li>
              4.1 There is no MINIMUM ORDER required.
            </li>
            <li>
              4.2 When ordering you will be directed to a secure service provider
              through whom you will pay the funds.
            </li>
          </ul>
        </div>

        <div className={styles.policyBlock}>
          <h3 className={styles.policyBlockTitle}>Article 5 Delivery of the articles</h3>
          <ul>
            <li>
              5.1 The order will be prepared and send as soon as payment is received.
              The date of payment is the date of credit the payment is received into our account.
            </li>
            <li>
              5.2 Sending the order usually takes place within 1 till 3 working days
              after receiving the payment. Exceptions are possible and depend on availability of the article.
              AMS is not responsible for delays if there are circumstances out of our control.
              When delivery is delayed because of AMS the customer will receive a notification.
            </li>
            <li>
              5.3 The customer had the ownership of the articles after they are paid for.
              The risk of the articles starts for the customer on the moment of delivery.
              Delivery is “from our distribution center’s”.
            </li>
          </ul>
        </div>

        <div className={styles.policyBlock}>
          <h3 className={styles.policyBlockTitle}>Article 6 Complains and liability</h3>
          <ul>
            <li>
              6.1 You have to check the order immediately after receiving.
              If the order is not correct and does not contain
              what you have ordered you must tell us immediately.
            </li>
            <li>
              6.2 You have the right to send back the order if it is not what you expected of it.
              You have to send it back within 7 days without giving any reason.
              The cost of sending back the order in that case is for the customer.
              Articles have to be unopened, undamaged and in original seal.
            </li>
            <li>
              6.3 Articles damaged during transport or are damaged because of other reasons,
              will not be taken back and will not be refunded, see 5.3.
            </li>
            <li>
              6.4 We are not responsible for the use and all consequences of the use
              of products delivered by our web shop.
              By the use of tools, we warn you about the risks you have.
            </li>
            <li>
              6.5 If you decide to use your right to send back the articles
              we will pay you back within 30 days after arrival of the article.
              It has to be unopened, undamaged, not used and in original seal.
              The cost incurred by AMS for shipment will not be refunded.
              The cost the customer incurred for sending back articles will not be refunded by AMS.
            </li>
          </ul>
        </div>
      </section>
    </>
  );
}
