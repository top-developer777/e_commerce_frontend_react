import { Product } from "./product";

export interface Order {
  id?: number;
  vendor_name: string;
  type: number;
  date: string;
  payment_mode: string;
  detailed_payment_method: string;
  delivery_mode: string;
  status: number;
  payment_status: number;
  customer_id: number;
  product_id: number[];
  quantity: number[];
  shipping_tax: number;
  shipping_tax_voucher_split: string;
  vouchers: string;
  proforms: string;
  attachments: string;
  cashed_co: number;
  cashed_cod: number;
  refunded_amount: string;
  is_complete: boolean;
  cancellation_reason: string;
  refund_status: string;
  maximum_date_for_shipment: string;
  late_shipment: number;
  flags: string;
  emag_club: boolean;
  finalization_date: string;
  details: string;
  payment_mode_id: number;
  market_place: string;
}