import Head from 'next/head';
import styles from '@/styles/modules/Account.module.scss';
import { FormEvent, useState } from 'react';
import Loader from '@/components/Loader';
import httpMethods from '@/constants/httpMethods';
import Link from 'next/link';
import { PASSWORD_REGEX } from '@/constants/regex';
import UserService from '@/services/user.service';
import ToastService from '@/services/toast.service';
import { ServerData } from '@/interfaces/serverData';
import { User } from '@/interfaces/user';
import { CONFIRM_PASSWORD_MESSAGE, PASSWORD_MESSAGE } from '@/constants/messages';
import LinkService from '@/services/link.service';
import fetchCsrfToken from '@/utils/fetchCsrfToken';
import { csrfHeader } from '@/constants/csrf';

const REGISTER_URL = LinkService.apiUserLink();
const REGISTER_TOAST_ERROR = 'register-error';

export default function Register() {
  const [user, setUser] = useState<User>();
  const [loading, setLoading] = useState<boolean>(false);

  return (
    <>
      <Head>
        <title>Create account - QuiPtaping</title>
        <meta name="dc.title" content="Create account - QuiPtaping" />
        <meta name="dc.relation" content={LinkService.registerLink()} />
        <meta property="og:url" content={LinkService.registerLink()} />
        <meta property="og:title" content="Create account - QuiPtaping" />
        <meta name="twitter:title" content="Create account - QuiPtaping" />
        <meta name="robots" content="follow, noindex" />
      </Head>
      <div className={`${styles.wrapper} container`}>
        {loading && <Loader />}
        {(!loading && !user)
          && <CreateAccount setLoading={setLoading} onSuccess={setUser} />}
        {(!loading && user) && <VerifyAccount />}
      </div>
    </>
  );
}

function CreateAccount(
  { setLoading, onSuccess }: { setLoading: CallableFunction, onSuccess: CallableFunction },
) {
  const [validationMessage, setValidationMessage] = useState<string>('');
  const [confirmValidationMessage, setConfirmValidationMessage] = useState<string>('');

  const clearValidation = () => {
    setValidationMessage('');
    setConfirmValidationMessage('');
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const form = new FormData(e.target as HTMLFormElement);
    const body = {
      email: form.get('email')?.toString() || '',
      name: form.get('name')?.toString() || '',
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
      const res = await fetch(REGISTER_URL, {
        method: httpMethods.post,
        headers: {
          'Content-Type': 'application/json',
          [csrfHeader]: token,
        },
        body: JSON.stringify(UserService.newUser(body)),
      });

      const { data }: ServerData<User | string> = await res.json();

      if (!res.ok) {
        throw new Error(data as string);
      }
      onSuccess(data);
    } catch (error: any) {
      console.error(error);
      ToastService.error(error.message as string, {
        toastId: REGISTER_TOAST_ERROR,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h1 className="title">Register</h1>
      <div className={styles.formWrapper}>
        <form action={REGISTER_URL} method={httpMethods.post} className={styles.form} onSubmit={onSubmit}>
          <div className={styles.formItem}>
            <label className={styles.formLabel} htmlFor="email">Email address</label>
            <input
              className={styles.formInput}
              type="email" inputMode="email" id="email"
              name="email" required
            />
          </div>
          <div className={styles.formItem}>
            <label className={styles.formLabel} htmlFor="name">Name</label>
            <input
              className={styles.formInput}
              type="text" inputMode="text" id="name"
              name="name" minLength={2} required
            />
          </div>
          <div className={styles.formItem}>
            <label className={styles.formLabel} htmlFor="password">Password</label>
            <input
              onInput={() => clearValidation()}
              className={styles.formInput}
              type="password" inputMode="text" id="password"
              name="password" autoComplete="true" required
            />
            {!!validationMessage && <p className={styles.error}>{validationMessage}</p>}
          </div>
          <div className={styles.formItem}>
            <label className={styles.formLabel} htmlFor="password">Confirm password</label>
            <input
              onInput={() => setConfirmValidationMessage('')}
              className={styles.formInput}
              type="password" inputMode="text" id="confirmPassword"
              name="confirmPassword" autoComplete="true" required
            />
            {!!confirmValidationMessage && <p className={styles.error}>{confirmValidationMessage}</p>}
          </div>
          <button className={styles.formBtn} type="submit">
            Sign up
          </button>
        </form>

        <div>
          Already have an account?&nbsp;
          <Link className={styles.link} href="/account">Log in</Link>
        </div>
      </div>
    </>
  );
}

function VerifyAccount() {
  return (
    <>
      <h1 className="title">Verify account</h1>
      <div>
        Your account has been created. We have sent you an email with verification link.
      </div>
      <p>
        Click on link to confirm your account and proceed with&nbsp;
        <Link className={styles.verifyLink} href="/account">Log in</Link>.
      </p>
    </>
  );
}
