export interface Shipment {
  id?: number;
  date: string;
  supplier_name: string;
  type: 'Airplain' | 'Sea' | 'Train';
  product_name_list: string[],
  quantity_list: number[],
  status: string;
  expect_date: string;
  note?: string;
}