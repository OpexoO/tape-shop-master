import '@/styles/globals.scss';
import '@fortawesome/fontawesome-svg-core/styles.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { CartProvider } from '@/context/cartContext';
import { ProductTypeCard } from '@/interfaces/productTypeCard';
import { useEffect, useRef, useState } from 'react';
import { Type } from '@/interfaces/type';
import { ServerData } from '@/interfaces/serverData';
import Loader from '@/components/Loader';
import { useRouter } from 'next/router';
import ToastService from '@/services/toast.service';
import LinkService from '@/services/link.service';
import Backdrop from '@mui/material/Backdrop';
import local from 'next/font/local';

const roboto = local({
  src: [
    {
      path: '../../public/fonts/roboto-regular.ttf',
      weight: '400',
    },
    {
      path: '../../public/fonts/roboto-medium.ttf',
      weight: '500',
    },
    {
      path: '../../public/fonts/roboto-bold.ttf',
      weight: '700',
    },
  ],
  style: 'normal',
  adjustFontFallback: false,
  preload: true,
  display: 'swap',
  variable: '--main-font',
});

const HIDE_MENU_PATHS = ['/admin'];

export default function App({ Component, pageProps }: AppProps) {
  const { pathname } = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const productTypes = useRef<ProductTypeCard[]>([]);

  useEffect(() => {
    setIsLoading(true);
    fetch(LinkService.apiTypesLink())
      .then((res: Response) => res.json())
      .then((data: ServerData<Type[]>) => {
        const types = data.data;
        const cards: ProductTypeCard[] = [];
        types.forEach(async (t: Type) => {
          const products: ServerData<unknown[]> = await (
            await fetch(LinkService.apiTypesProductsLink(t._id))
          ).json();
          cards.push({
            id: t.id,
            title: t.name,
            count: products.data.length,
          });
        });
        productTypes.current = cards;
      })
      .catch(() => {
        ToastService.error('An error has occured');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta charSet="UTF-8" />
        <link rel="icon" type="image/png" href="/images/favicon.png" />
        {!HIDE_MENU_PATHS.includes(pathname)
          && <>
            <meta name="dc.source" content={process.env.NEXT_PUBLIC_DOMAIN} />
            <meta name="dc.language" content="en_US" />
            <meta property="og:site_name" content="Quiptaping" />
            <meta property="og:locale" content="en_US" />
            <meta property="og:type" content="article" />
            <meta property="article:author" content="https://www.facebook.com/Quiptaping/" />
            <meta property="article:publisher" content="https://www.facebook.com/Quiptaping/" />
            <meta
              property="og:image"
              content={`${process.env.NEXT_PUBLIC_DOMAIN}/images/favicon.png`}
            />
            <meta
              property="og:image:secure_url"
              content={`${process.env.NEXT_PUBLIC_DOMAIN}/images/favicon.png`}
            />
            <meta property="og:image:width" content="512" />
            <meta property="og:image:height" content="512" />
            <meta property="og:image:alt" content="QuiPtaping favicon" />
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="theme-color" content="#EEEEEE" />
          </>
        }
      </Head>
      <CartProvider>
        <div className={`content ${roboto.className}`}>
          {!HIDE_MENU_PATHS.includes(pathname) && <Header types={productTypes.current} />}
          <main className="main">
            <Component {...pageProps} />
          </main>
          {!HIDE_MENU_PATHS.includes(pathname) && <Footer />}
          <Backdrop
            sx={{ zIndex: 1001 }}
            open={isLoading}
          >
            <Loader key="backdrop-loader" customColor="#fff" />
          </Backdrop>
        </div>

        <style jsx>{`
          .content {
            display: flex;
            flex-direction: column;
            justify-content: center;
            min-height: 100vh;
          }
          
          .main {
            flex: 1;
          }
        `}</style>
      </CartProvider>
    </>
  );
}
