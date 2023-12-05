import { memo, useRef, useState } from 'react';
import { Order, OrderItem } from '@/interfaces/order';
import { formatDate, formatPrice } from '@/utils/helpers';
import styles from '@/styles/modules/Order.module.scss';
import trackingStatuses from '@/constants/trackingStatuses';
import OrderDetailsModal from './OrderDetailsModal';
import OrderReturnModal from './OrderReturnModal';

function OrdersListComponent({ orders }: { orders: Order[] }) {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isReturnModalOpen, setIsReturnModalOpen] = useState<boolean>(false);
  const modalOrderRef = useRef<Order>();
  const modalReturnOrderRef = useRef<string>();

  if (!orders?.length) {
    return <div className={styles.ordersEmpty}>You have no active or shipped orders</div>;
  }

  const onModalClose = () => {
    setIsModalOpen(false);
  };

  const onModalOpen = (order: Order) => {
    modalOrderRef.current = order;
    setIsModalOpen(true);
  };

  const onReturnModalClose = () => {
    setIsReturnModalOpen(false);
  };

  const onReturnModalOpen = () => {
    setIsReturnModalOpen(true);
  };

  const createReturn = (orderId: string) => {
    modalReturnOrderRef.current = orderId;
    onReturnModalOpen();
  };

  return (
    <>
      <section className={styles.ordersContainer}>
        <h3>Here is list of your orders:</h3>

        <div className={styles.orders}>
          {orders.map((order: Order) => (
            <div className={styles.orderItem} key={order.orderId}>
              <div className={styles.orderItemHeader}>
                <span className="bold">Order number: {order.orderId}</span>
                <button className={styles.link} onClick={() => onModalOpen(order)}>
                  More info
                </button>
              </div>
              <div className={styles.orderItemBlocks}>
                <div className={styles.orderItemBlock}>
                  <span className="bold">Date of order</span>
                  <time dateTime={order.date}>{formatDate(order.date)}</time>
                </div>
                <div className={styles.orderItemBlock}>
                  <span className="bold">Total</span>
                  <span>$ {formatPrice(order.total)}</span>
                </div>
                <div className={styles.orderItemBlock}>
                  <span className="bold">Status</span>
                  <span>{order.status || 'Unshipped'}</span>
                </div>
                {!!order.trackingNumber
                  && <div className={styles.orderItemBlock}>
                    <a className={styles.link}
                      target="_blank" rel="noopener"
                      href={`${order.trackingUrl}${order.trackingNumber}`}
                    >
                      Track your package
                    </a>
                  </div>
                }
                {order.status === trackingStatuses.Delivered
                  && <div className={styles.orderItemBlock}>
                    <button className={styles.link} onClick={() => createReturn(order.orderId)}>
                      Make a return
                    </button>
                  </div>
                }
              </div>
              <div className={styles.orderItemBlock}>
                <span className="bold">Items</span>
                <div>
                  {order.items.map((item: OrderItem, idx: number) => (
                    <span key={item.info._id}>
                      <a href={`/products/${item.info._id}`} className={styles.link}>
                        {item.info.name}
                      </a> ({item.total}){idx === order.items.length - 1
                        ? ''
                        : ', '
                      }
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <OrderDetailsModal
        isOpen={isModalOpen}
        onClose={onModalClose}
        orderId={modalOrderRef.current?.orderId || ''}
        orderTotal={modalOrderRef.current?.total || 0}
      />

      <OrderReturnModal
        isOpen={isReturnModalOpen}
        onClose={onReturnModalClose}
        orderId={modalReturnOrderRef.current || ''}
      />
    </>
  );
}

const OrdersList = memo(OrdersListComponent);
export default OrdersList;
