import { NewOrder, Order, PreparedOrder, ReturnedOrder } from '@/interfaces/order';
import { ShippingOrder } from '@/interfaces/shippingOrders';
import { Product, ProductItemPreview } from '@/interfaces/product/product';
import ProductService from './product.service';
import UserService from './user.service';

export default class OrderService {
  public static fromServer(fields: any, products: Product[]): Order {
    return ({
      _id: fields._id.toString(),
      orderId: fields.orderId,
      userId: fields.userId,
      total: +fields.total,
      date: fields.date,
      items: fields.items.map((i: any, idx: number) => ({
        total: i.total,
        info: ProductService.toPartialPreview(products[idx]) as ProductItemPreview,
      })),
      status: fields.status,
      trackingUrl: fields.trackingUrl,
      trackingNumber: fields.trackingNumber,
    });
  }

  public static returnedFromServer(fields: any): ReturnedOrder {
    return ({
      _id: fields._id.toString(),
      id: fields.orderId,
      orderId: fields.orderId,
      reason: fields.reason,
      message: fields.message,
      status: fields.status,
      date: fields.date,
      user: UserService.fromServer(fields.user),
    });
  }

  public static prepareFieds(fields: NewOrder, userId: string): PreparedOrder {
    return ({
      orderId: fields.orderId,
      userId,
      items: fields.items,
      total: fields.total,
      status: fields.status,
      trackingUrl: fields.trackingUrl,
      trackingNumber: fields.trackingNumber,
      date: new Date().toISOString(),
    });
  }

  public static shippingOrderFromServer(fields: any): ShippingOrder {
    return ({
      order_id: fields.order_id,
      order_date: fields.order_date,
      order_number: fields.order_number,
      reference: fields.reference,
      carrier: fields.carrier,
      carrier_name: fields.carrier_name,
      carrier_service_code: fields.carrier_service_code,
      shipping_method: fields.shipping_method,
      shipping_description: fields.shipping_description,
      signature_required: fields.signature_required,
      currency: fields.currency,
      declared_value: fields.declared_value,
      create_return: fields.create_return,
      manifest_number: fields.manifest_number,
      type: fields.type,
      status: fields.status,
      manifested: fields.manifested,
      sender_details: fields.sender_details,
      destination: fields.destination,
      items: fields.items,
      packages: fields.packages,
    });
  }
}
