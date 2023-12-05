import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import ToastService from '@/services/toast.service';
import { User } from '@/interfaces/user';
import { ServerData } from '@/interfaces/serverData';
import styles from '@/styles/modules/Account.module.scss';
import LinkService from '@/services/link.service';
import statusCodes from '@/constants/statusCodes';
import UserService from '@/services/user.service';
import ShippingService from '@/services/shipping.service';
import { useCartContext } from '@/context/cartContext';
import { Order } from '@/interfaces/order';
import Loader from './Loader';

const OrdersList = dynamic(() => import('@/components/OrdersList'), { ssr: false });

const ERROR_TOAST_ID = 'fetch-user-error';

export default function Account({ onLogout }: { onLogout: CallableFunction }) {
  const [isLoading, setLoading] = useState<boolean>(false);
  const { getSessionCart, resetCart } = useCartContext();
  const [user, setUser] = useState<User>();
  const userOrdersRef = useRef<Order[]>([]);

  const resetState = () => {
    resetCart();
    ShippingService.deleteShippingRateFromStorage();
    UserService.deleteUserToken();
    UserService.deleteSession();
  };

  const logout = () => {
    resetState();
    getSessionCart(true);
    onLogout();
  };

  const login = (data: User) => {
    setUser(data);
    UserService.setSession(data._id);
    getSessionCart();
  };

  useEffect(() => {
    const fetchData = async () => {
      const fetchUser = () => fetch(LinkService.apiUserLink(), {
        headers: { Authorization: UserService.getUserToken() },
      });
      const fetchOrders = () => fetch(LinkService.apiOrders(), {
        headers: { Authorization: UserService.getUserToken() },
      });

      try {
        const [userRes, ordersRes] = await Promise.all([fetchUser(), fetchOrders()]);
        const [userData, ordersData]:
          [ServerData<User | string>, ServerData<Order[] | string>] = await Promise.all(
            [userRes.json(), ordersRes.json()],
          );
        if ([userRes.status, ordersRes.status].includes(statusCodes.Unauthorized)) {
          logout();
        }
        if (!userRes.ok) {
          throw new Error(userData.data as string);
        } else if (!ordersRes.ok) {
          throw new Error(ordersData.data as string);
        }

        userOrdersRef.current = ordersData.data as Order[];
        login(userData.data as User);
      } catch (error: any) {
        console.error(error);
        ToastService.error(error.message as string, {
          toastId: ERROR_TOAST_ID,
        });
      } finally {
        setLoading(false);
      }
    };

    setLoading(true);
    fetchData();
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <section>
      <h2 className="title">
        Hello, {user?.name}
      </h2>

      <OrdersList orders={userOrdersRef.current} />

      <button className={styles.formBtn} onClick={logout}>
        Log out
      </button>
    </section>
  );
}
