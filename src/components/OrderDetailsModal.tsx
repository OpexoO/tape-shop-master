/* eslint-disable camelcase */
import { Dialog, DialogActions, DialogTitle, Button, DialogContent } from '@mui/material';
import { useEffect, useState } from 'react';
import LinkService from '@/services/link.service';
import UserService from '@/services/user.service';
import statusCodes from '@/constants/statusCodes';
import styles from '@/styles/modules/Order.module.scss';
import {
  ShippingOrder, ShippingOrderDestination, ShippingOrderItem, ShippingOrderPackage, ShippingOrderResponse,
} from '@/interfaces/shippingOrders';
import ToastService from '@/services/toast.service';
import { formatDate, formatPrice } from '@/utils/helpers';
import Loader from './Loader';

type Props = {
  isOpen: boolean;
  orderId: string;
  orderTotal: number;
  onClose: () => void;
}

const mergeAddress = (destination: ShippingOrderDestination): string => {
  const { post_code, suburb, city, state, country } = destination;
  let result: string = '';
  if (post_code) {
    result += `${post_code}, `;
  }
  if (suburb) {
    result += `${suburb}, `;
  }
  if (city) {
    result += `${city}, `;
  }
  if (state) {
    result += `${state}, `;
  }
  result += country;
  return result;
};

export default function OrderDetailsModal({ isOpen, onClose, orderId, orderTotal }: Props) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [order, setOrder] = useState<ShippingOrder>();

  useEffect(() => {
    if (!orderId) return;

    const fetchData = async () => {
      try {
        const res = await fetch(LinkService.apiOrderDetails(orderId), {
          headers: { Authorization: UserService.getUserToken() },
        });
        const data = await res.json() as ShippingOrderResponse;
        if (res.status === statusCodes.Unauthorized) {
          UserService.deleteUserToken();
        }
        if (!res.ok || !data.order) {
          throw new Error(data.errors[0]?.details);
        }
        setOrder(data.order!);
      } catch (err: any) {
        console.error(err.message);
        onClose();
        ToastService.error(err.message || 'An error has occured');
      } finally {
        setIsLoading(false);
      }
    };

    setIsLoading(true);
    fetchData();
  }, [orderId]);

  return (
    <Dialog
      fullWidth
      open={isOpen}
      onClose={onClose}
      scroll="paper"
    >
      <DialogTitle>Order {order?.order_number || ''}</DialogTitle>
      <DialogContent dividers={true}>
        {isLoading && <div className={styles.modalIndent}><Loader /></div>}
        {!isLoading && !!order
          && <>
            <div className={styles.orderItemBlocksModal}>
              <div className={styles.orderItemBlock}>
                <span className="bold">Date of order</span>
                <time>{formatDate(order.order_date)}</time>
              </div>
              <div className={styles.orderItemBlock}>
                <span className="bold">Status</span>
                <span>{order.status}</span>
              </div>
              <div className={styles.orderItemBlock}>
                <span className="bold">Type</span>
                <span>{order.type}</span>
              </div>
            </div>

            <div className={styles.orderItemBlockWithIndent}>
              <span className="bold">Total: $ {formatPrice(orderTotal)}</span>
              <span>Subtotal: $ {formatPrice(order.declared_value)}</span>
              <span>Shipping: $ {formatPrice(orderTotal - order.declared_value)}</span>
            </div>

            <div className={styles.orderItemBlockWithIndent}>
              <span className="bold">Shipping details</span>
              <span>Courier: {order.carrier_name}</span>
              <span>Method: {order.shipping_method}</span>
              {!!order.shipping_description && <span>{order.shipping_description}</span>}
            </div>

            <div className={styles.orderItemBlockWithIndent}>
              <span className="bold">Shipping destination</span>
              <span>
                {order.destination.name}
                {!!order.destination.email
                  && <>, <a className={styles.link} href={`mailto:${order.destination.email}`}>
                    {order.destination.email}
                  </a></>
                }
                {!!order.destination.phone
                  && <>, <a className={styles.link} href={`tel:${order.destination.phone}`}>
                    {order.destination.phone}
                  </a></>
                }
              </span>
              {!!order.destination.company && <span>{order.destination.company}</span>}
              <span>
                {order.destination.street}&nbsp;
                {!!order.destination.building && <span>{order.destination.building}</span>}
              </span>
              <span>{mergeAddress(order.destination)}</span>
              {!!order.destination.delivery_instructions
                && <span>Instructions: {order.destination.delivery_instructions}</span>}
            </div>

            <div className={styles.orderItemBlockWithIndent}>
              <span className="bold">Items</span>
              <div className={styles.orderItemBlocksModalSm}>
                {order.items.map((i: ShippingOrderItem) => (
                  <div key={i.item_id} className={styles.orderItemBlock}>
                    <span>Name: {i.description}</span>
                    <span>SKU: {i.sku}</span>
                    <span>Price: $ {i.value}</span>
                    <span>Amount: {i.quantity}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.orderItemBlockWithIndent}>
              <span className="bold">Packages</span>
              <div className={styles.orderItemBlocksModalSm}>
                {order.packages.map((i: ShippingOrderPackage) => (
                  <div key={i.package_id} className={styles.orderItemBlock}>
                    <span>Name: {i.name}</span>
                    <span>Shipping: {i.carrier_service_name}</span>
                    {!!i.packaging_type && <span>Packaging type: {i.packaging_type}</span>}
                    {!!i.delivery_status && <span>Status: {i.delivery_status}</span>}
                    {!!i.tracking_number
                      && <a href={`${i.tracking_url}${i.tracking_number}`}
                        className={styles.link}
                        target="_blank" rel="noopener">
                        Track this package
                      </a>
                    }
                  </div>
                ))}
              </div>
            </div>
          </>
        }
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog >
  );
}
