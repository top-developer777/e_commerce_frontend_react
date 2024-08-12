export interface Return {
  emag_id: number;
  order_id: number;
  type: number;
  customer_name: string;
  customer_company: string;
  customer_phone: string;
  products: number[];
  quantity: number[];
  observations: string[];
  pickup_address: string;
  return_reason: number;
  return_type: number;
  replacement_product_emag_id: number;
  replacement_product_id: number;
  replacement_product_name: string;
  replacement_product_quantity: number;
  date: string;
  request_status: number;
  return_market_place: string;
}