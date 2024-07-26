export interface Shipment {
  id?: number;
  order_id: number;
  create_date: string;
  title: string;
  agent_name: string;
  type: 'Airplain' | 'Sea' | 'Train';
  status: string;
  delivery_date: string;
  warehouse: string;
  note?: string;
  ean: string[],
  quantity: number[],
  supplier_name: string[],
  item: number[],
  pdf_sent: boolean[],
  pay_url: string[],
  tracking: string[],
  arrive_agent: boolean[],
  wechat_group: string[],
  pp: string[],
  each_status: string[],
  shipment_name: string[],
  box_number: number[],
  document: string[],
  add_date: string[],
  date_agent: string[],
  SID: string[],
  GID: string[],
  date_port: string[],
  newid: string[],
}