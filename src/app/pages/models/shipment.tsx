export interface ShippingProduct {
  shippingType?: string;
  ean: string;
  quantity: number;
  item_per_box: number;
  pdf_sent: boolean;
  pay_url: string;
  tracking: string;
  arrive_agent: boolean;
  wechat_group: string;
  pp: string;
  each_status: string;
  box_number: number;
  document: string;
  date_added: string;
  date_agent: string;
  user: number;
}

export interface Shipment {
  id?: number;
  title: string;
  create_date: string;
  delivery_date: string;
  type: 'Airplain' | 'Sea' | 'Train';
  status: string;
  warehouse: string;
  note: string;
  agent: string;
  awb: string;
  vat: number;
  custom_taxes: number;
  shipment_cost: number;
  ean: string[];
  quantity: number[];
  item_per_box: number[];
  pdf_sent: boolean[];
  pay_url: string[];
  tracking: string[];
  arrive_agent: boolean[];
  wechat_group: string[];
  pp: string[];
  each_status: string[];
  box_number: number[];
  document: string[];
  date_added: string[];
  date_agent: string[];
  user: number[];
}