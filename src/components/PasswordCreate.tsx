import Head from 'next/head';
import styles from '@/styles/modules/Account.module.scss';
import httpMethods from '@/constants/httpMethods';
import { FormEvent, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import Loader from '@/components/Loader';
import ToastService from '@/services/toast.service';
import { ServerData } from '@/interfaces/serverData';
import { PASSWORD_REGEX } from '@/constants/regex';
import { CONFIRM_PASSWORD_MESSAGE, PASSWORD_MESSAGE } from '@/constants/messages';
import LinkService from '@/services/link.service';
import { csrfHeader } from '@/constants/csrf';
import fetchCsrfToken from '@/utils/fetchCsrfToken';

const RESET_URL = LinkService.apiUserResetLink();
const PASSWORD_URL = LinkService.apiUserPasswordLink();

export default function PasswordCreate() {
  const [validationMessage, setValidationMessage] = useState<string>('');
  const [confirmValidationMessage, setConfirmValidationMessage] = useState<string>('');
  const [loading, setLoading] = useState<Boolean>(false);
  const hashRef = useRef<string>('');
  const toast = useRef<number | string>();
  const { isReady, pathname, replace, query: { hash = '' } } = useRouter();

  useEffect(() => {
    if (!isReady) {
      return;
    }

    const redirect = (url: string) => {
      replace(url, undefined, { shallow: true });
    };

    setLoading(true);
    fetch(`${RESET_URL}?hash=${hash}`)
      .then(async (res: Response) => {
        const { data }: ServerData<string> = await res.json();
        if (!res.ok) {
          throw new Error(data as string);
        }
        hashRef.current = hash as string;
        redirect(pathname);
      })
      .catch((error: any) => {
        console.error(error);
        if (!ToastService.isActive(toast.current)) {
          toast.current = ToastService.error(error.message as string, { autoClose: 5000 });
        }
        redirect('/account');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [isReady]);

  const clearValidation = () => {
    setValidationMessage('');
    setConfirmValidationMessage('');
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const form = new FormData(e.target as HTMLFormElement);
    const body = {
      password: form.get('password')?.toString() || '',
      confirmPassword: form.get('confirmPassword')?.toString() || '',
    };
    if (!PASSWORD_REGEX.test(body.password)) {
      setValidationMessage(PASSWORD_MESSAGE);
      return;
    }
    if (body.password !== body.confirmPassword) {
      setConfirmValidationMessage(CONFIRM_PASSWORD_MESSAGE);
      return;
    }
    clearValidation();

    try {
      setLoading(true);
      const token = await fetchCsrfToken();
      const res = await fetch(PASSWORD_URL, {
        method: httpMethods.post,
        headers: {
          'Content-Type': 'application/json',
          [csrfHeader]: token,
        },
        body: JSON.stringify({
          hash: hashRef.current,
          password: body.password,
        }),
      });

      const { data }: ServerData<string> = await res.json();
      if (!res.ok) {
        throw new Error(data as string);
      }
      ToastService.success(data as string, { autoClose: 4000 });
    } catch (error: any) {
      console.error(error);
      ToastService.error(error.message as string);
    } finally {
      setLoading(false);
      replace('/account');
    }
  };

  return (
    <>
      <Head>
        <title>Reset password - QuiPtaping</title>
        <meta name="dc.title" content="Reset password - QuiPtaping" />
        <meta name="dc.relation" content={LinkService.resetLink()} />
        <meta name="robots" content="follow, noindex" />
        <meta property="og:url" content={LinkService.resetLink()} />
        <meta property="og:title" content="Reset password - QuiPtaping" />
        <meta name="twitter:title" content="Reset password - QuiPtaping" />
      </Head>
      <div className={`${styles.wrapper} container`}>
        {loading && <Loader />}
        {!loading
          && <>
            <h1 className="title">Create new password</h1>
            <div className={styles.formWrapper}>
              <form
                action={PASSWORD_URL}
                method={httpMethods.post}
                className={styles.form}
                onSubmit={onSubmit}
              >
                <div className={styles.formItem}>
                  <label className={styles.formLabel} htmlFor="password">New password</label>
                  <input
                    onInput={() => clearValidation()}
                    className={styles.formInput}
                    type="password" inputMode="text" id="password"
                    name="password" autoComplete="true" required
                  />
                  {!!validationMessage && <p className={styles.error}>{validationMessage}</p>}
                </div>
                <div className={styles.formItem}>
                  <label className={styles.formLabel} htmlFor="confirmPassword">Confirm password</label>
                  <input
                    onInput={() => setConfirmValidationMessage('')}
                    className={styles.formInput}
                    type="password" inputMode="text" id="confirmPassword"
                    name="confirmPassword" autoComplete="true" required
                  />
                  {!!confirmValidationMessage && <p className={styles.error}>{confirmValidationMessage}</p>}
                </div>
                <button className={styles.formBtn} type="submit">
                  Create password
                </button>
              </form>
            </div>
          </>
        }
      </div>
    </>
  );
}
