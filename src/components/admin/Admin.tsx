import createTheme from '@mui/material/styles/createTheme';
import { Admin, Resource, defaultTheme } from 'react-admin';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBookmark, faCartShopping, faComment, faGift, faMessage, faRotateLeft, faTag,
} from '@fortawesome/free-solid-svg-icons';
import adminResourceMap from '@/constants/admin-resources';
import authProvider from '@/context/adminAuthProvider';
import dataProvider from '@/context/adminDataProvider';
import Head from 'next/head';
import categories from './categories';
import types from './types';
import feedbacks from './feedbacks';
import products from './products';
import reviews from './reviews';
import coupons from './coupons';
import returnedOrders from './returnedOrders';

const resourceIcons = {
  products: () => <FontAwesomeIcon icon={faCartShopping} />,
  categories: () => <FontAwesomeIcon icon={faBookmark} />,
  types: () => <FontAwesomeIcon icon={faTag} />,
  contactFeedbacks: () => <FontAwesomeIcon icon={faMessage} />,
  reviews: () => <FontAwesomeIcon icon={faComment} />,
  coupons: () => <FontAwesomeIcon icon={faGift} />,
  returnedOrders: () => <FontAwesomeIcon icon={faRotateLeft} />,
};

const theme = createTheme(
  {
    ...defaultTheme,
    palette: {
      secondary: {
        main: '#383838',
      },
    },
  },
);

export default function AdminPage() {
  return (
    <>
      <Head>
        <title>Admin - QuiPtaping</title>
        <meta name="robots" content="noindex, noarchive" />
        <meta name="referrer" content="strict-origin-when-cross-origin" />
      </Head>

      <Admin
        basename="/admin"
        dataProvider={dataProvider}
        authProvider={authProvider}
        theme={theme}
        requireAuth
      >
        <Resource name={adminResourceMap.products} {...products} icon={resourceIcons.products} />
        <Resource name={adminResourceMap.categories} {...categories} icon={resourceIcons.categories} />
        <Resource name={adminResourceMap.types} {...types} icon={resourceIcons.types} />
        <Resource name={adminResourceMap.feedback} {...feedbacks} icon={resourceIcons.contactFeedbacks} />
        <Resource name={adminResourceMap.reviews} {...reviews} icon={resourceIcons.reviews} />
        <Resource name={adminResourceMap.coupons} {...coupons} icon={resourceIcons.coupons} />
        <Resource
          name={adminResourceMap.returnedOrders}
          {...returnedOrders}
          icon={resourceIcons.returnedOrders}
        />
      </Admin>
    </>
  );
}
