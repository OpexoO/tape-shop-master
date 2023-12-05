/* eslint-disable no-unused-vars */
import Head from 'next/head';
import { useCartContext } from '@/context/cartContext';
import { CartItem } from '@/interfaces/cart';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo, faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import Image from 'next/image';
import AmountHandler from '@/components/AmountHandler';
import { formatPrice, roundPrice } from '@/utils/helpers';
import {
  ChangeEvent, FormEvent, ReactNode, memo,
  useCallback, useEffect, useMemo, useRef, useState,
} from 'react';
import ToastService from '@/services/toast.service';
import ScreenUtils from '@/utils/screen';
import httpMethods from '@/constants/httpMethods';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Tooltip from '@mui/material/Tooltip';
import LinkService from '@/services/link.service';
import { ShippingRate, ShippingDestination } from '@/interfaces/shippingRates';
import ShippingService from '@/services/shipping.service';
import CurrentCountry from '@/services/country.service';
import ConditionalWrapper from '@/components/ConditionalWrapper';
import { ServerData } from '@/interfaces/serverData';
import { AppliedCoupon } from '@/interfaces/coupon';
import UserService from '@/services/user.service';
import couponType from '@/constants/coupon';
import styles from '@/styles/modules/Cart.module.scss';
import deepEqual from '@/utils/deepEqual';
import { useRouter } from 'next/router';
import LoginRequiredModal from '@/components/LoginRequired';
import { getNumberOfRolesName, getTapeWidthName } from '@/utils/tapeOptionsUtils';

type CartTableProps = {
  isTablet: boolean;
  items: CartItem[];
  couponName?: string;
  removeCoupon: CallableFunction;
  removeAllItem: CallableFunction;
  changeProductAmount: CallableFunction;
  onCouponApplied: CallableFunction;
}

type CartTotalProps = {
  isTablet: boolean;
  totalPrice: number;
  appliedCouponPrice: number | undefined;
  shippingRates: ShippingRate[] | null;
  selectedRate: ShippingRate | undefined;
  defaultAddress: ShippingDestination | null;
  fetchShipping: (form: FormData) => void;
  onSelect: (rate: ShippingRate) => void;
  handleCheckout: () => void;
  onReset: CallableFunction;
  couponText: string;
}

const COUPOUN_APPLY_TOAST_SUCCESS = 'coupon-apply-success';
const COUPOUN_APPLY_TOAST_ERROR = 'coupon-apply-error';

const CartTotalMemo = memo(CartTotal);
const CartTableMemo = memo(CartTable);

export default function Cart() {
  const { cart, removeItems, addItems, applyCoupon, applyShipping, setLoading } = useCartContext();
  const [isTablet, setIsTablet] = useState(false);
  const [shippingRates, setShippingRates] = useState<ShippingRate[] | null>(null);
  const [selectedRate, setSelectedRate] = useState<ShippingRate>();
  const [addressForm, setAddressForm] = useState<ShippingDestination | null>();
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const initialAddress = useRef<ShippingDestination | null>(null);
  const router = useRouter();

  useEffect(() => {
    setIsTablet(ScreenUtils.isTablet());
    const handleResize = () => setIsTablet(ScreenUtils.isTablet());
    window.addEventListener('resize', handleResize);

    const rate = ShippingService.getShippingRateFromStorage();
    if (rate) {
      setSelectedRate(rate);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    setAppliedCoupon(cart.coupon || null);
  }, [cart.coupon]);

  useEffect(() => {
    if (cart.totalAmount < 0) {
      reset();
      return;
    }
    if (cart.coupon?.code) {
      applyCouponCode(cart.coupon.code);
    }
    if ((shippingRates?.length || 0) <= 0) {
      return;
    }
    applyShipping(cart.items, addressForm!).then(setShippingRates);
  }, [cart.totalAmount]);

  useEffect(() => {
    // only for initializing cart and to prevent effect loop
    const { shippingDestination } = cart;
    if (!deepEqual(shippingDestination, addressForm)) {
      initialAddress.current = shippingDestination;
      setAddressForm(shippingDestination);
    }
  }, [cart.shippingDestination]);

  useEffect(() => {
    if (addressForm === undefined) return; // To prevent changing cart on BE on first render
    if (addressForm === null) setSelectedRate(undefined);
    applyShipping(cart.items, addressForm).then(setShippingRates);
  }, [addressForm]);

  useEffect(() => {
    if (selectedRate) {
      ShippingService.saveShippingRateInStorage(selectedRate);
    } else {
      ShippingService.deleteShippingRateFromStorage();
    }
  }, [selectedRate]);

  useEffect(() => {
    if (shippingRates?.length) {
      setSelectedRate((state: ShippingRate | undefined) => {
        const found = shippingRates?.find((r: ShippingRate) => r.service_code === state?.service_code);
        return found ?? shippingRates[0];
      });
    }
  }, [shippingRates]);

  const reset = useCallback(() => {
    initialAddress.current = null;
    ShippingService.deleteShippingRateFromStorage();
    setShippingRates(null);
    setSelectedRate(undefined);
    setAddressForm(null);
  }, []);

  const changeAddress = useCallback((destinationForm: FormData) => {
    setAddressForm(ShippingService.prepareDestination(destinationForm));
  }, []);

  const changeProductAmount = useCallback(
    (item: CartItem, amount: number, isDelete?: boolean): Promise<boolean> => {
      const func = (isDelete || amount === 0) ? removeItems : addItems;
      return func(item.info);
    },
    [removeItems, addItems],
  );
  const clearCoupon = useCallback(async () => {
    setAppliedCoupon(null);
    await applyCoupon(null);
  }, [applyCoupon]);

  const applyCouponCode = useCallback(async (code: string): Promise<string> => {
    let name: string = '';
    if (!code) return name;

    try {
      setLoading(true);
      const res = await fetch(LinkService.apiApplyCouponLink(), {
        method: httpMethods.post,
        body: JSON.stringify({ code }),
        headers: {
          'Content-Type': 'Application/json',
          Authorization: UserService.getUserToken(),
        },
      });
      const { data }: ServerData<AppliedCoupon | string> = await res.json();
      if (!res.ok) {
        throw new Error(data as string);
      }
      const result = await applyCoupon(data as AppliedCoupon);
      if (typeof result === 'string') return name;
      if (!result) {
        clearCoupon();
        return name;
      }
      setAppliedCoupon(data as AppliedCoupon);
      name = (data as AppliedCoupon).name;
    } catch (err: any) {
      setLoading(false);
      clearCoupon();
      ToastService.error(err.message, {
        toastId: COUPOUN_APPLY_TOAST_ERROR,
      });
    }

    return name;
  }, [applyCoupon, clearCoupon, setLoading]);

  const onApplyCouponCode = useCallback(async (code: string) => {
    const name = await applyCouponCode(code);
    if (name) {
      ToastService.success(
        `${name} has been applied successfully`,
        { toastId: COUPOUN_APPLY_TOAST_SUCCESS },
      );
    }
  }, [applyCouponCode]);

  const removeCoupon = useCallback(async () => {
    await clearCoupon();
    ToastService.success('Coupon has been removed successfully');
  }, [clearCoupon]);

  const couponText = useMemo(() => {
    const productsEnum: string[] = [];
    if (appliedCoupon?.appliedProducts.length) {
      appliedCoupon?.appliedProducts.forEach((id: string) => {
        const found = cart.items.find((i: CartItem) => i.info._id === id);
        if (found) {
          productsEnum.push(found.info.name);
        }
      });
    } else {
      cart.items.forEach((i: CartItem) => {
        productsEnum.push(i.info.name);
      });
    }

    const discountText = `${appliedCoupon?.type === couponType.Flat
      ? `$${appliedCoupon.discount}`
      : `${appliedCoupon?.discount}%`}`;
    const discountExceededText = appliedCoupon?.maximumDiscount === cart.appliedCouponPrice
      ? `
        Due to the fact that maximum discount is exceeded, 
        the discount amount is $${appliedCoupon?.maximumDiscount}
      `
      : '';
    const text = `
    ${appliedCoupon?.name} ${appliedCoupon?.type.toLowerCase()} coupon on ${discountText} has been applied.
    The Coupon discount applies to the following products: ${productsEnum.join(', ')}. ${discountExceededText}
    `;
    return text;
  }, [cart.items, cart.appliedCouponPrice, appliedCoupon]);

  const handleCheckout = () => {
    if (UserService.getUserToken()) {
      router.push('/checkout');
    } else {
      setIsModalOpen(true);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Head>
        <title>Cart - QuiPtaping</title>
        <meta name="dc.title" content="Cart - QuiPtaping" />
        <meta name="dc.description" content="Cart" />
        <meta name="dc.relation" content={LinkService.cartLink()} />
        <meta name="robots" content="follow, noindex" />
        <meta property="og:url" content={LinkService.cartLink()} />
        <meta property="og:title" content="Cart - QuiPtaping" />
        <meta property="og:description" content="Cart" />
        <meta name="twitter:title" content="Cart - QuiPtaping" />
        <meta name="twitter:description" content="Cart" />
      </Head>

      <section className={`${styles.cart} container`}>
        <h1 className="title centered">Cart</h1>

        <CartTableMemo
          isTablet={isTablet}
          items={cart.items}
          couponName={appliedCoupon?.name}
          removeCoupon={removeCoupon}
          removeAllItem={removeItems}
          changeProductAmount={changeProductAmount}
          onCouponApplied={onApplyCouponCode}
        />
        {!!cart.totalAmount
          && <CartTotalMemo
            isTablet={isTablet}
            fetchShipping={changeAddress}
            appliedCouponPrice={cart.appliedCouponPrice}
            totalPrice={cart.totalPrice}
            defaultAddress={initialAddress.current}
            shippingRates={shippingRates}
            selectedRate={selectedRate}
            onSelect={setSelectedRate}
            onReset={reset}
            couponText={couponText}
            handleCheckout={handleCheckout}
          />
        }
      </section>

      <LoginRequiredModal isOpen={isModalOpen} onClose={handleModalClose} />
    </>
  );
}

function CartTable(
  { items, couponName, removeCoupon, removeAllItem,
    changeProductAmount, onCouponApplied, isTablet }: CartTableProps,
) {
  const inputRef = useRef<HTMLInputElement>(null);

  if ((items?.length || 0) === 0) {
    return <div>Your cart is currently empty.</div>;
  }

  if (isTablet) {
    return (
      <>
        <table className={styles.cartTable} cellSpacing={0}>
          <tbody>
            {items.map((c: CartItem) => (
              <tr key={`${c.info._id}${c.info.selectedOption || ''}`}>
                <td style={{ justifyContent: 'flex-end' }}>
                  <FontAwesomeIcon
                    className={styles.cartTableIcon}
                    onClick={() => removeAllItem(c.info, true)}
                    icon={faCircleXmark} size="xl"
                  />
                </td>
                <td style={{ justifyContent: 'center' }}>
                  <Link href={`/products/${c.info._id}`}>
                    <Image
                      className={styles.cartTableImg}
                      src={c.info.images[0]}
                      alt={c.info.name}
                      width={90}
                      height={90}
                      decoding="async"
                      loading="lazy"
                    />
                  </Link>
                </td>
                <td>
                  <span className="bold">Product:</span>
                  <div>
                    <Link className={`${styles.cartTableName} bold`} href={`/products/${c.info._id}`}>
                      {c.info.name}
                    </Link>
                    {!!c.info.selectedOption
                      && <div className={styles.cartTableNameOptions}>
                        <div>
                          <span className="bold">Tape width: </span>
                          {getTapeWidthName(c.info.selectedOption)}
                        </div>
                        <div>
                          <span className="bold">Number of roles: </span>
                          {getNumberOfRolesName(c.info.selectedOption)}
                        </div>
                      </div>
                    }
                  </div>
                </td>
                <td>
                  <span className="bold">Price:</span>
                  <span>$ {c.info.price}</span>
                </td>
                <td>
                  <span className="bold">Quantity:</span>
                  <AmountHandler
                    availability={c.info.availability}
                    initialValue={c.total}
                    readonly={true}
                    onChange={
                      (amount: number, isDelete?: boolean) => changeProductAmount(c, amount, isDelete)
                    }
                  />
                </td>
                <td>
                  <span className="bold">Subtotal:</span>
                  <span>$ {formatPrice(roundPrice(c.total * c.info.price))}</span>
                </td>
              </tr>
            ))}
            <tr>
              <td style={{ display: 'block' }} colSpan={6}>
                <div className={styles.cartTableAction}>
                  <input
                    className={styles.cartTableInput}
                    type="text"
                    ref={inputRef}
                    placeholder="Coupon code"
                    required
                  />
                  <button
                    className={styles.cartTableBtn}
                    onClick={() => {
                      onCouponApplied(inputRef.current?.value);
                      (inputRef.current as HTMLInputElement).value = '';
                    }}
                  >
                    Apply coupon
                  </button>
                </div>
                {!!couponName && <div className={styles.cartTableCouponCaption}>
                  {couponName} coupon has been applied.
                  You can <button
                    onClick={() => {
                      (inputRef.current as HTMLInputElement).value = '';
                      removeCoupon();
                    }}
                    className={`${styles.cartLink} ${styles.cartTableActionLink}`}>
                    remove it.
                  </button>
                </div>
                }
              </td>
            </tr>
          </tbody>
        </table>
      </>
    );
  }

  return (
    <>
      <table className={styles.cartTable}>
        <thead>
          <tr>
            <th></th>
            <th></th>
            <th>Product</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {items.map((c: CartItem) => (
            <tr key={`${c.info._id}${c.info.selectedOption || ''}`}>
              <td>
                <FontAwesomeIcon
                  className={styles.cartTableIcon}
                  onClick={() => removeAllItem(c.info, true)}
                  icon={faCircleXmark} size="xl"
                />
              </td>
              <td>
                <Link href={`/products/${c.info._id}`}>
                  <Image
                    className={styles.cartTableImg}
                    src={c.info.images[0]}
                    alt={c.info.name}
                    width={85}
                    height={85}
                    decoding="async"
                    loading="lazy"
                  />
                </Link>
              </td>
              <td>
                <Link className={`${styles.cartTableName} bold`} href={`/products/${c.info._id}`}>
                  {c.info.name}
                </Link>
                {!!c.info.selectedOption
                  && <div className={styles.cartTableNameOptions}>
                    <div>
                      <span className="bold">Tape width: </span>
                      {getTapeWidthName(c.info.selectedOption)}
                    </div>
                    <div>
                      <span className="bold">Number of roles: </span>
                      {getNumberOfRolesName(c.info.selectedOption)}
                    </div>
                  </div>
                }
              </td>
              <td>
                $ {c.info.price}
              </td>
              <td>
                <AmountHandler
                  availability={c.info.availability}
                  initialValue={c.total}
                  readonly={true}
                  onChange={
                    (amount: number, isDelete?: boolean) => changeProductAmount(c, amount, isDelete)
                  }
                />
              </td>
              <td>
                $ {formatPrice(roundPrice(c.total * c.info.price))}
              </td>
            </tr>
          ))}
          <tr>
            <td colSpan={6}>
              <div className={styles.cartTableAction}>
                <input
                  className={styles.cartTableInput}
                  type="text"
                  ref={inputRef}
                  placeholder="Coupon code"
                  required
                />
                <button
                  className={styles.cartTableBtn}
                  onClick={() => {
                    onCouponApplied(inputRef.current?.value);
                    (inputRef.current as HTMLInputElement).value = '';
                  }}
                >
                  Apply coupon
                </button>
              </div>
              {!!couponName && <div className={styles.cartTableCouponCaption}>
                {couponName} coupon has been applied.
                You can <button
                  onClick={() => {
                    (inputRef.current as HTMLInputElement).value = '';
                    removeCoupon();
                  }}
                  className={`${styles.cartLink} ${styles.cartTableActionLink}`}>
                  remove it.
                </button>
              </div>
              }
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );
}

function CartTotal({ appliedCouponPrice, totalPrice, fetchShipping, onSelect, selectedRate,
  shippingRates, defaultAddress, isTablet, onReset, couponText, handleCheckout }: CartTotalProps) {
  const [currentAddress, setCurrentAddress] = useState<string>('');

  useEffect(() => {
    if (defaultAddress) {
      const { city, post_code: postal, street, country_code: country } = defaultAddress;
      setCurrentAddress(`${street}, ${city}, ${postal}, ${country}`);
    }
  }, [defaultAddress]);

  const conditionalWrapper = (children: ReactNode) => (
    <div className={styles.cartTotalMobileWrapper}>{children}</div>
  );

  const setAddress = (form: FormData) => {
    const city = form.get('city')?.toString() || '';
    const street = form.get('street')?.toString() || '';
    const postal = form.get('postal')?.toString() || '';
    setCurrentAddress(`${street}, ${city}, ${postal}, ${CurrentCountry.countryName}`);
  };

  const calculateShipping = (e: FormEvent) => {
    e.preventDefault();

    const form = new FormData(e.target as HTMLFormElement);
    fetchShipping(form);
    setAddress(form);
  };

  const reset = () => {
    setCurrentAddress('');
    onReset();
  };

  const setCurrentRate = (e: ChangeEvent) => {
    const { value } = e.target as HTMLInputElement;
    onSelect(
      shippingRates?.find((r: ShippingRate) => r.service_code === value)!,
    );
  };

  const calculateTotal = useMemo(() => {
    const shippingRate = selectedRate?.total_price || 0;
    const couponTotal = appliedCouponPrice || 0;

    return roundPrice(totalPrice + shippingRate - couponTotal);
  }, [appliedCouponPrice, totalPrice, selectedRate?.total_price]);

  return (
    <div className={styles.cartTotal}>
      <table className={styles.cartTable}>
        <thead>
          <tr>
            <th colSpan={2} className={`${styles.cartTotalTitle} title`}>
              Cart totals
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th className={`${styles.cartTotalHeading} bold`}>Subtotal: </th>
            <td>
              <span className={`${styles.cartTotalCaption} bold`}>Subtotal:</span>
              <span>$ {formatPrice(roundPrice(totalPrice))}</span>
            </td>
          </tr>
          {!!appliedCouponPrice
            && <tr>
              <th className={`${styles.cartTotalHeading} bold`}>Coupon sale: </th>
              <td>
                <span className={`${styles.cartTotalCaption} bold`}>Coupon sale:</span>
                <div>
                  <span>$ {formatPrice(appliedCouponPrice)}</span>
                  <Tooltip
                    arrow={true}
                    disableInteractive={true}
                    title={couponText}
                    placement="top"
                  >
                    <FontAwesomeIcon
                      className={`${styles.cartTableIcon} ${styles.cartTooltipIcon}`}
                      icon={faCircleInfo}
                    />
                  </Tooltip>
                </div>
              </td>
            </tr>
          }
          <tr>
            <th className={`${styles.cartTotalHeading} bold`}>Shipping: </th>
            <td className={styles.cartTotalShipping}>
              <ConditionalWrapper wrapper={conditionalWrapper} condition={isTablet}>
                <span className={`${styles.cartTotalCaption} bold`}>Shipping:</span>
                <div>
                  {!shippingRates && 'Shipping options will be updated during checkout.'}
                  {shippingRates?.length === 0
                    && <>
                      No shipping options were found for
                      <div className="bold">
                        {currentAddress || 'default'}
                      </div>
                    </>
                  }
                  {(shippingRates?.length || 0) > 0
                    && <>
                      <FormControl>
                        <RadioGroup
                          value={selectedRate?.service_code || ''}
                          onChange={setCurrentRate}
                        >
                          {shippingRates?.map((rate: ShippingRate) => (
                            <FormControlLabel
                              sx={{
                                '& .MuiFormControlLabel-label': {
                                  fontSize: isTablet ? 14 : 16,
                                },
                              }}
                              className={styles.cartTotalLabel}
                              key={rate.service_code}
                              control={
                                <Radio sx={{
                                  '&': { padding: '8px' },
                                  '& .MuiSvgIcon-root': { fontSize: isTablet ? 15 : 16 },
                                }}
                                />
                              }
                              value={rate.service_code}
                              label={`${rate.service_name} - $ ${formatPrice(rate.total_price)}`}
                            />
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <div className={`${styles.topIndentSm} ${styles.cartTotalShippingAddressMobile}`}>
                        Shipping with {selectedRate?.service_name} to&nbsp;
                        <div className="bold">{currentAddress}</div>
                      </div>
                      <div className={styles.topIndentSm}>
                        Shipping cost: ${formatPrice(selectedRate?.total_price || 0)}
                      </div>
                    </>
                  }
                </div>
              </ConditionalWrapper>
              <div>
                <Accordion sx={{
                  backgroundColor: 'inherit',
                  color: 'inherit',
                  boxShadow: 'none',
                }}>
                  <AccordionSummary sx={{
                    '&': {
                      padding: 0,
                      minHeight: 'auto',
                    },
                    '&.Mui-expanded': {
                      minHeight: 'auto',
                    },
                    '& .MuiAccordionSummary-content': {
                      margin: 0,
                    },
                    '& .MuiAccordionSummary-content.Mui-expanded': {
                      margin: 0,
                    },
                  }}>
                    <a className={styles.cartLink}>
                      {shippingRates ? 'Change address' : 'Calculate shipping'}
                    </a>
                  </AccordionSummary>
                  <AccordionDetails sx={{ padding: 0 }}>
                    <form
                      className={styles.cartTotalForm} method={httpMethods.post}
                      action={LinkService.apiOrdersRatesLink()} onSubmit={calculateShipping}
                      onReset={reset}
                    >
                      <select
                        className={styles.cartTotalInput}
                        defaultValue={CurrentCountry.countryCode} name="country" id="country"
                      >
                        <option style={{ pointerEvents: 'none' }} value={CurrentCountry.countryCode}>
                          {CurrentCountry.countryName}
                        </option>
                      </select>
                      <input
                        defaultValue={defaultAddress?.city || ''}
                        className={styles.cartTotalInput}
                        type="text" placeholder="City"
                        id="city" name="city" required
                      />
                      <input
                        defaultValue={defaultAddress?.street || ''}
                        className={styles.cartTotalInput}
                        type="text" placeholder="Street"
                        id="street" name="street" required
                      />
                      <input
                        defaultValue={defaultAddress?.post_code || ''}
                        className={styles.cartTotalInput}
                        type="text" placeholder="Postal code"
                        id="postal" name="postal" required
                      />
                      <div className={styles.cartTotalActions}>
                        <button className={styles.cartTotalFormBtn} type="submit">
                          Update
                        </button>
                        <button className={styles.cartLink} type="reset">
                          Clear
                        </button>
                      </div>
                    </form>
                  </AccordionDetails>
                </Accordion>
              </div>
            </td>
          </tr>
          <tr>
            <th className={`${styles.cartTotalHeading} bold`}>Total: </th>
            <td>
              <span className={`${styles.cartTotalCaption} bold`}>Total:</span>
              <span>$ {formatPrice(calculateTotal)}</span>
            </td>
          </tr>
          <tr>
            <td colSpan={2}>
              <button onClick={handleCheckout} className={styles.cartTableBtn}>
                Proceed to checkout
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
