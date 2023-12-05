import storageKeys from '@/constants/storageKeys';
import { CartContextProps, Cart, CartItem } from '@/interfaces/cart';
import { ProductItemPreview } from '@/interfaces/product/product';
import CartService from '@/services/cart.service';
import ToastService from '@/services/toast.service';
import {
  ReactNode, createContext, useCallback, useContext, useEffect, useMemo, useRef, useState,
} from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from '@/styles/modules/Home.module.scss';
import { AppliedCoupon } from '@/interfaces/coupon';
import LinkService from '@/services/link.service';
import httpMethods from '@/constants/httpMethods';
import UserService from '@/services/user.service';
import ShippingService from '@/services/shipping.service';
import statusCodes from '@/constants/statusCodes';
import { generateId } from '@/utils/helpers';
import { cartActions, CartActionsType } from '@/constants/cartActions';
import Backdrop from '@mui/material/Backdrop';
import Loader from '@/components/Loader';
import { ShippingDestination, ShippingRate, ShippingRatesResponse } from '@/interfaces/shippingRates';
import EncryptionService from '@/services/encryption.service';
import deepEqual from '@/utils/deepEqual';
import fetchCsrfToken from '@/utils/fetchCsrfToken';
import { csrfHeader } from '@/constants/csrf';

const COUPON_APPLY_CONTEXT_ERROR = 'coupon-context-error';
const ADD_ITEMS_TOAST = 'add-items';
const REMOVE_ITEMS_TOAST = 'remove-items';
const DEFAULT_TEXT = 'An error has occured';

const defaultCartContext: CartContextProps = {
  cart: {
    id: '',
    _id: '',
    ...CartService.initialCartState,
  } as Cart,
  setLoading: () => { },
  addItems: () => Promise.resolve(true),
  removeItems: () => Promise.resolve(true),
  applyCoupon: () => Promise.resolve(true),
  applyShipping: () => Promise.resolve(null),
  getSessionCart: () => { },
  resetCart: () => { },
  deleteCartFromDb: () => Promise.resolve(),
  saveCartToMerge: () => { },
};

export const CartContext = createContext<CartContextProps>(defaultCartContext);

export const useCartContext = () => useContext(CartContext);

const cartRequest = async (session: string, method: string = httpMethods.get, body: any = {}) => {
  const csrf = await fetchCsrfToken();
  const headers = new Headers({
    'Content-Type': 'Application/json',
    [csrfHeader]: csrf,
  });
  const token = UserService.getUserToken();
  if (token) {
    headers.set('Authorization', token);
  }

  const requestInit: RequestInit = {
    method, headers,
  };
  if ([httpMethods.patch, httpMethods.post].includes(method)) {
    requestInit.body = JSON.stringify(body);
  }

  return fetch(LinkService.apiCartLink(session), requestInit);
};

const resetAuthToken = () => {
  const event = new CustomEvent('storage', { detail: { key: storageKeys.Auth } });
  window.dispatchEvent(event);
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<Cart>(defaultCartContext.cart);
  const [savedCart, setSavedCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const action = useRef<CartActionsType>();

  const addItems = useCallback(
    async (items: ProductItemPreview | CartItem) => {
      let result: boolean = false;
      setIsLoading(true);
      action.current = cartActions.Add;
      try {
        const res = await cartRequest(UserService.getSession(), httpMethods.patch, {
          action: cartActions.Add,
          item: CartService.toServerCartItem(CartService.toCartItem(items)),
        });
        const data = await res.json();
        if (data.data) {
          result = true;
          setCart(data.data);
        }
        if (res.status === statusCodes.Unauthorized) {
          UserService.deleteUserToken();
          UserService.deleteSession();
          resetAuthToken();
          await createCartInDb(CartService.initialCartState);
        }
        if (!res.ok) {
          throw new Error(data.error);
        }
      } catch (err: any) {
        console.error(err);
        action.current = undefined;
        ToastService.error(err?.message || DEFAULT_TEXT, { toastId: ADD_ITEMS_TOAST });
      } finally {
        setIsLoading(false);
      }
      return result;
    },
    [],
  );
  const removeItems = useCallback(
    async (item: ProductItemPreview, deleteAll?: boolean) => {
      let result: boolean = false;
      setIsLoading(true);
      action.current = cartActions.Remove;
      try {
        const res = await cartRequest(UserService.getSession(), httpMethods.patch, {
          action: deleteAll ? cartActions.RemoveAll : cartActions.Remove,
          item: CartService.toServerCartItem(CartService.toCartItem(item)),
        });
        const data = await res.json();
        if (data.data) {
          result = true;
          setCart(data.data);
        }
        if (res.status === statusCodes.Unauthorized) {
          UserService.deleteUserToken();
          UserService.deleteSession();
          resetAuthToken();
          await createCartInDb(CartService.initialCartState);
        }
        if (!res.ok) {
          throw new Error(data.error);
        }
      } catch (err: any) {
        console.error(err);
        action.current = undefined;
        ToastService.error(err?.message || DEFAULT_TEXT, { toastId: REMOVE_ITEMS_TOAST });
      } finally {
        setIsLoading(false);
      }
      return result;
    },
    [],
  );

  const applyCoupon = useCallback(
    async (coupon: AppliedCoupon | null) => {
      const req = () => cartRequest(UserService.getSession(), httpMethods.patch, {
        action: cartActions.Coupon,
        coupon,
      });

      action.current = cartActions.Coupon;
      let success: boolean | string = 'skip';
      try {
        setIsLoading(true);
        const res = await req();
        const data = await res.json();
        if (data.data) {
          setCart(data.data);
        }
        if (res.status === statusCodes.Unauthorized) {
          UserService.deleteUserToken();
          UserService.deleteSession();
          resetAuthToken();
          await createCartInDb(CartService.initialCartState);
        }
        if (!res.ok) {
          throw new Error(data.error);
        } else {
          success = true;
        }
      } catch (err: any) {
        console.error(err);
        action.current = undefined;
        success = false;
        ToastService.error(err?.message || DEFAULT_TEXT, { toastId: COUPON_APPLY_CONTEXT_ERROR });
      } finally {
        setIsLoading(false);
      }
      return success;
    },
    [],
  );
  const applyShipping = useCallback(
    async (items: CartItem[], destination: ShippingDestination | null) => {
      let rates: ShippingRate[] | null = null;
      if (!items || !Array.isArray(items) || items?.length === 0) {
        return rates;
      }

      try {
        setIsLoading(true);
        if (destination) {
          const res = await fetch(LinkService.apiOrdersRatesLink(), {
            method: httpMethods.post,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(ShippingService.prepareRatesBody(destination, items)),
          });
          const data: ShippingRatesResponse = await res.json();
          if (!data.success) {
            throw new Error(data.errors[0]?.details);
          }
          rates = [...data.rates];
        }

        if (!deepEqual(destination, cart.shippingDestination)) {
          const cartRes = await cartRequest(UserService.getSession(), httpMethods.patch, {
            action: cartActions.Shipping,
            shippingDestination: destination,
          });
          const cartData = await cartRes.json();
          if (cartData.data) {
            setCart(cartData.data);
          }
          if (cartRes.status === statusCodes.Unauthorized) {
            UserService.deleteUserToken();
            UserService.deleteSession();
            resetAuthToken();
            await createCartInDb(CartService.initialCartState);
          }
          if (!cartRes.ok) {
            throw new Error(cartData.error);
          }
        }
      } catch (err: any) {
        console.error(err);
        ToastService.error(err?.message || DEFAULT_TEXT);
      } finally {
        setIsLoading(false);
      }
      return rates;
    },
    [cart.shippingDestination],
  );

  const saveCartToMerge = useCallback(() => {
    if (!deepEqual(cart, CartService.initialCartState)) {
      setSavedCart(cart);
    }
  }, [cart]);
  const resetCart = useCallback(() => {
    const session = UserService.getSession() || '';
    setCart({
      ...defaultCartContext.cart,
      id: session,
      _id: session,
    });
  }, []);

  const deleteCartFromDb = useCallback(async (session: string) => {
    const deleteFromDb = () => cartRequest(session, httpMethods.delete);
    if (!session) return;

    try {
      let res: Response = await deleteFromDb();
      if (res.status === statusCodes.ServerError) {
        res = await deleteFromDb();
      }
      if (!res.ok) {
        const { data } = await res.json();
        throw new Error(data);
      }
    } catch (err: any) {
      console.error(err);
      ToastService.error(err?.message || DEFAULT_TEXT);
    }
  }, []);
  const createCartInDb = useCallback(async (customCart: Partial<Cart>, newSession?: string) => {
    const session = newSession || generateId();
    const encryptionService = new EncryptionService(session);
    const { cipherText, iv } = await encryptionService.encrypt();

    const body = {
      cart: {
        ...customCart,
        items: (customCart.items || []).map(CartService.toServerCartItem),
      },
      userId: cipherText,
      iv,
    };
    setIsLoading(true);
    try {
      const csrf = await fetchCsrfToken();
      const res = await fetch(LinkService.apiCreateCartLink(), {
        method: httpMethods.post,
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'Application/json',
          [csrfHeader]: csrf,
        },
      });
      const data = await res.json();
      if (data.data) {
        UserService.setSession(data.data.userId);
        setCart(data.data);
      }
      if (!res.ok) {
        throw new Error(data.error);
      }
    } catch (err: any) {
      console.error(err.message);
      ToastService.error(err?.message || DEFAULT_TEXT);
    } finally {
      setIsLoading(false);
    }
  }, []);
  const initCartFromDb = async () => {
    const session = UserService.getSession();
    if (!session) {
      return;
    }

    setIsLoading(true);
    action.current = undefined;
    try {
      const res = await cartRequest(session);
      const data = await res.json();
      if (res.status === statusCodes.NotFound) {
        setSavedCart(null);
        createCartInDb(cart, session);
        return;
      }
      if (res.status === statusCodes.Unauthorized) {
        UserService.deleteUserToken();
        UserService.deleteSession();
        resetAuthToken();
        await createCartInDb(CartService.initialCartState);
        setIsLoading(false);
        return;
      }
      if (!res.ok) {
        throw new Error(data.error);
      }
      let mergedCart: Cart = { ...data.data };
      if (savedCart) {
        const csrf = await fetchCsrfToken();
        const body = {
          savedCart: {
            ...savedCart,
            items: (savedCart.items || []).map(CartService.toServerCartItem),
          },
        };
        const patchRes = await fetch(LinkService.apiMergeCartLink(session), {
          method: httpMethods.patch,
          body: JSON.stringify(body),
          headers: {
            'Content-Type': 'Application/json',
            [csrfHeader]: csrf,
          },
        });
        const data = await patchRes.json();
        if (data.data) {
          mergedCart = data.data;
        }
        if (!res.ok) {
          throw new Error(data.error);
        }
        setSavedCart(null);
      }
      setCart(mergedCart);
    } catch (err: any) {
      console.error(err.message);
      ToastService.error(err?.message || DEFAULT_TEXT);
    } finally {
      setIsLoading(false);
    }
  };

  const getSessionCart = async (toCreate?: boolean) => {
    if (toCreate || !UserService.getSession()) {
      await createCartInDb(CartService.initialCartState);
    } else {
      await initCartFromDb();
    }
  };

  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key === storageKeys.Cart) {
        action.current = undefined;
        setCart(JSON.parse(e.newValue as string));
      }
    };
    window.addEventListener('storage', handler);

    getSessionCart();

    return () => {
      window.removeEventListener('storage', handler);
    };
  }, []);

  useEffect(() => {
    let toasterText: string = '';
    if (action.current === cartActions.Add) {
      toasterText = 'Item has been added to cart';
    } else if (action.current === cartActions.Remove) {
      toasterText = 'Item has been removed from cart';
    }

    if (toasterText) {
      ToastService.success(toasterText);
      action.current = undefined;
    }
  }, [cart]);

  const currentCart = useMemo(() => ({ ...cart }), [cart]);

  return (
    <>
      <CartContext.Provider value={{
        cart: currentCart,
        setLoading: setIsLoading,
        addItems,
        removeItems,
        resetCart,
        applyCoupon,
        applyShipping,
        getSessionCart,
        deleteCartFromDb,
        saveCartToMerge,
      }}
      >
        {children}
      </CartContext.Provider>
      <ToastContainer className={styles.toasterContainer} />

      <Backdrop
        sx={{ zIndex: 1001 }}
        open={isLoading}
      >
        <Loader key="backdrop-loader" customColor="#fff" />
      </Backdrop>
    </>
  );
};
