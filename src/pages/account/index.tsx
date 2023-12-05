import Account from '@/components/Account';
import Login from '@/components/Login';
import storageKeys from '@/constants/storageKeys';
import LinkService from '@/services/link.service';
import UserService from '@/services/user.service';
import Head from 'next/head';
import { useEffect, useState } from 'react';

export default function AccountPage() {
  const [hasToken, setHasToken] = useState<boolean>(false);

  useEffect(() => {
    const handler = (e: StorageEvent | CustomEvent) => {
      if (e instanceof CustomEvent) {
        if (e.detail.key !== storageKeys.Auth) return;
        setHasToken(false);
      } else if (e instanceof StorageEvent) {
        if (e.key !== storageKeys.Auth) return;
        const stringifiedValue = e.newValue || JSON.stringify('');
        setHasToken(!!JSON.parse(stringifiedValue));
      }
    };
    window.addEventListener('storage', handler);
    setHasToken(!!UserService.getUserToken());

    return () => {
      window.removeEventListener('storage', handler);
    };
  }, []);

  return (
    <>
      <Head>
        <title>My account - QuiPtaping</title>
        <meta name="dc.title" content="My account - QuiPtaping" />
        <meta name="dc.relation" content={LinkService.accountLink()} />
        <meta property="og:url" content={LinkService.accountLink()} />
        <meta property="og:title" content="My account - QuiPtaping" />
        <meta name="twitter:title" content="My account - QuiPtaping" />
        <meta name="robots" content="follow, noindex" />
      </Head>
      <div className="container">
        {hasToken && <Account onLogout={() => setHasToken(false)} />}
        {!hasToken && <Login onLogin={() => setHasToken(true)} />}
      </div>
    </>
  );
}
