import Head from 'next/head';
import styles from '@/styles/modules/Account.module.scss';
import httpMethods from '@/constants/httpMethods';
import { FormEvent, useState } from 'react';
import { ServerData } from '@/interfaces/serverData';
import ToastService from '@/services/toast.service';
import Loader from '@/components/Loader';
import { useRouter } from 'next/router';
import LinkService from '@/services/link.service';
import fetchCsrfToken from '@/utils/fetchCsrfToken';
import { csrfHeader } from '@/constants/csrf';

const RESET_URL = LinkService.apiUserResetLink();
const RESET_TOAST_SUCCESS = 'reset-success';
const RESET_TOAST_ERROR = 'reset-error';

export default function Reset() {
  const [loading, setLoading] = useState<boolean>(false);
  const { back } = useRouter();

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const form = new FormData(e.target as HTMLFormElement);
    const email = form.get('email')?.toString() || '';
    try {
      setLoading(true);
      const token = await fetchCsrfToken();
      const res = await fetch(RESET_URL, {
        method: httpMethods.post,
        body: JSON.stringify({ email }),
        headers: {
          'Content-type': 'Application/json',
          [csrfHeader]: token,
        },
      });
      const { data }: ServerData<string> = await res.json();

      if (!res.ok) {
        throw new Error(data);
      }

      ToastService.success(data, {
        autoClose: 4000,
        toastId: RESET_TOAST_SUCCESS,
      });
    } catch (error: any) {
      console.error(error);
      ToastService.error(error.message as string, {
        toastId: RESET_TOAST_ERROR,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Reset password - QuiPtaping</title>
        <meta name="dc.title" content="Reset password - QuiPtaping" />
        <meta name="dc.relation" content={LinkService.resetLink()} />
        <meta property="og:url" content={LinkService.resetLink()} />
        <meta property="og:title" content="Reset password - QuiPtaping" />
        <meta name="twitter:title" content="Reset password - QuiPtaping" />
        <meta name="robots" content="follow, noindex" />
      </Head>
      <div className={`${styles.wrapper} container`}>
        {loading && <Loader />}
        {!loading
          && <>
            <p>Lost your password?</p>
            <p className={styles.indentL}>
              Please enter email address and
              you will receive a link to create a new password via email.
            </p>

            <form action={RESET_URL} method={httpMethods.post} className={styles.form} onSubmit={onSubmit}>
              <div className={styles.formItem}>
                <label className={styles.formLabel} htmlFor="email">Email address</label>
                <input
                  className={styles.formInput}
                  type="email" inputMode="email" id="email"
                  name="email" required
                />
              </div>
              <div className={styles.formActions}>
                <button className={styles.formBtn} type="submit">
                  Reset password
                </button>
                <button className={styles.link} type="reset" onClick={back}>
                  Back
                </button>
              </div>
            </form>
          </>
        }
      </div>
    </>
  );
}
