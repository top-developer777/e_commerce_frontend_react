import { Product } from "./product";

export interface Order {
  vendor_name: string;
  type: number;
  parent_id: number;
  date: string;
  payment_mode: string;
  detailed_payment_method: string;
  delivery_mode: string;
  observation: string;
  status: number;
  payment_status: number;
  customer_id: number;
  product: Product;
  shipping_tax: number;
  shipping_tax_voucher_split: string;
  vouchers: string;
  proforms: string;
  attachments: string;
  cashed_co: number;
  cashed_cod: number;
  cancellation_request: string;
  has_editable_products: boolean;
  refunded_amount: string;
  is_complete: boolean;
  reason_cancellation: string;
  refund_status: string;
  maximum_date_for_shipment: string;
  late_shipment: number;
  flags: string;
  emag_club: boolean;
  finalization_date: string;
  details: string;
  weekend_delivery: boolean;
  payment_mode_id: number;
}