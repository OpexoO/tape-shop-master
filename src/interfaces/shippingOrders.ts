import { ShippingError } from './shippingError';

export interface ShippingOrderResponse {
  order?: ShippingOrder;
  success: boolean;
  errors: ShippingError[];
}

export interface ShippingOrder {
  order_id: number;
  order_date: string;
  order_number: string;
  reference: string;
  carrier: string;
  carrier_name: string;
  carrier_service_code: string;
  shipping_method: string;
  shipping_description: string;
  signature_required: string;
  currency: string;
  declared_value: number;
  create_return: boolean;
  manifest_number: number;
  type: string;
  status: string;
  manifested: string;
  sender_details: ShippingOrderDestination;
  destination: ShippingOrderDestination;
  items: ShippingOrderItem[];
  packages: ShippingOrderPackage[];
}

export interface ShippingOrderDestination {
  name: string;
  email?: string;
  phone?: string;
  building?: string;
  company?: string;
  street: string;
  suburb: string;
  country: string;
  city?: string;
  state?: string;
  post_code?: string;
  delivery_instructions?: string;
  tax_number?: string;
}

export interface ShippingOrderItem {
  item_id: number;
  description: string;
  sku: string;
  tariff_code: string;
  country_of_origin: string;
  quantity: number;
  quantity_to_ship: number;
  weight: number;
  value: number;
}

export interface ShippingOrderPackage {
  package_id: number;
  name: string;
  weight: number;
  height: number;
  width: number;
  length: number;
  packaging_type: string;
  carrier_service_code: string;
  carrier_service_name: string;
  tracking_number: string;
  tracking_url: string;
  delivery_status: string;
  shipment_type: string;
  label_created_date: string;
  contents: string;
  labels: {
    label_type: string;
    label_url: string;
    label_base64_string: string;
  }[];
}
