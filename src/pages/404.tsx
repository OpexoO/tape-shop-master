import Head from 'next/head';
import { useRouter } from 'next/router';
import styles from '@/styles/modules/Home.module.scss';

export default function NotFound() {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>404 - Page not found - QuiPtaping</title>
        <meta name="robots" content="follow, noindex" />
      </Head>
      <div className={`${styles.notFoundContainer} container`}>
        <h2 className={styles.notFoundTitle}>Oops... Wrong turn</h2>
        <p>
          You have been redirected to a page that no longer exists.
        </p>
        <button className={styles.notFoundBtn} onClick={() => router.back()}>
          Go back
        </button>
      </div>
    </>
  );
}
