import Head from 'next/head';
import styles from '@/styles/modules/Policy.module.scss';
import LinkService from '@/services/link.service';

export default function PrivacyPolicy() {
  return (
    <>
      <Head>
        <title>Privacy policy - QuiPtaping</title>
        <meta
          name="description"
          content="QuiPtaping privacy policy"
        />
        <meta name="dc.title" content="Privacy policy - QuiPtaping" />
        <meta
          name="dc.description"
          content="QuiPtaping privacy policy"
        />
        <meta name="dc.relation" content={LinkService.ppLink()} />
        <meta name="robots" content="index, follow" />
        <meta
          name="googlebot"
          content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
        />
        <meta
          name="bingbot"
          content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
        />
        <link rel="canonical" href={LinkService.ppLink()} />
        <meta property="og:url" content={LinkService.ppLink()} />
        <meta property="og:title" content="Privacy policy - QuiPtaping" />
        <meta
          property="og:description"
          content="QuiPtaping privacy policy"
        />
        <meta property="twitter:title" content="Privacy policy - QuiPtaping" />
        <meta
          name="twitter:description"
          content="QuiPtaping privacy policy"
        />
      </Head>
      <section className="container">
        <h1 className={`title ${styles.policyTitle}`}>Privacy policy</h1>

        <div className={styles.policyBlock}>
          <h3 className={styles.policyBlockTitle}>Privacy and security</h3>
          <p>
            Your personal information. You leave them with us,
            because you have to do that if you want to order something.
            But we can imagine that you would like to know why we ask for
            your personal information and what we do with it. We are happy to tell you that here.
            If you have any questions after reading this, please let us know via our customer service.
          </p>
        </div>

        <div className={styles.policyBlock}>
          <h3 className={styles.policyBlockTitle}>Very safe</h3>
          <p className={styles.policyIndent}>
            We will safely and securely lock all data you leave with us using the latest technology.
            Those who have nothing to do with your data simply cannot access it.
            If we give your data to someone else – you can read below why and when we do that –
            then we require that the other person treats your data as carefully as
            we do and uses it only for the purpose for which he received it.
          </p>

          <p>What else do we do with your data?</p>
          <p>
            We use your data for various purposes. Below you can see which goals they are.
            We use data received from you, but also data collected by ourselves.
            For example, data about your visit to our website.
          </p>
        </div>

        <div className={styles.policyBlock}>
          <h3 className={styles.policyBlockTitle}>Deliver your order</h3>
          <p>
            For your order we need your name, e-mail address, address (es), payment details and
            sometimes your telephone number.
            That way we can deliver your order and keep you informed about your order.
            We also give your information to others if necessary for an order,
            for example to delivery services and our distribution center.
            We require our external sellers to handle your data with the same care as we do.
          </p>
        </div>

        <div className={styles.policyBlock}>
          <h3 className={styles.policyBlockTitle}>Your account</h3>
          <p>
            In your account on quiptaping, we store the following information, among other things:
            your name, address (s), telephone number, e-mail address, delivery and payment details and
            specified information and interests (for example if we have asked you for your date of birth).
            Handy, because then you don’t have to enter this information every time.
            We also store information about your previous orders so that you can easily find them.
          </p>
        </div>

        <div className={styles.policyBlock}>
          <h3 className={styles.policyBlockTitle}>Newsletters</h3>
          <p>
            You can sign up for our various newsletters. This way you stay informed of our offers,
            promotions and our news.We have general and personal newsletters.
            We compile the personal newsletters based on your data, such as previous orders.
            That makes the newsletter more interesting for you.
          </p>
        </div>

        <div className={styles.policyBlock}>
          <h3 className={styles.policyBlockTitle}>Reviews</h3>
          <p>
            We love reviews. And our customers too.
            If you want to write a review, choose whether your personal information or
            your name is visible to other visitors and whether we can contact you about your review.
            We keep track of who writes which review.
          </p>
        </div>

        <div className={styles.policyBlock}>
          <h3 className={styles.policyBlockTitle}>Contests</h3>
          <p className={styles.policyIndent}>
            If you participate in a promotion or competition,
            we ask for your name, address and e-mail address.
            This way we can carry out the promotion and announce the prize winner (s).
            We also measure the response to our advertising campaigns in this way.
          </p>
          <p className={styles.policyIndent}>Improvement of our store and service</p>
          <p>
            We are constantly improving our services. That is why we can use your data to ask you
            if you want to participate in a no-obligation customer or market survey.
            Sometimes others do that research for us. We provide that other than your e-mail address.
            The other person must of course also adhere to our privacy rules.
            For example, your e-mail address must be deleted after the investigation.
          </p>
        </div>

        <div className={styles.policyBlock}>
          <h3 className={styles.policyBlockTitle}>Fraud</h3>
          <p className={styles.policyIndent}>
            Nobody is waiting for fraud, including us. That is why we use customer data to investigate,
            prevent and combat fraud. If necessary, we provide customer information to the government.
          </p>
          <p className={styles.policyIndent}>Business customers and partner program</p>
          <p>
            We also store contact details for our business customers and partners.
            If it is personal data, we treat this data just like that of our other customers.
          </p>
        </div>

        <div className={styles.policyBlock}>
          <h3 className={styles.policyBlockTitle}>Social media</h3>
          <p className={styles.policyIndent}>
            Nobody is waiting for fraud, including us. That is why we use customer data to investigate,
            prevent and combat fraud. If necessary, we provide customer information to the government.
          </p>
          <p className={styles.policyIndent}>What do we not do with your data?</p>
          <p>
            We never use your data to show you different prices than other customers.
            All our customers see the same prices for our items and products.
            We also never sell your data to others.
          </p>
        </div>
      </section>
    </>
  );
}
