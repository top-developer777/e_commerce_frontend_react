import { Product } from "./product";

export interface Shipment {
  id?: number;
  shipment_id: string;
  date: string;
  name: string;
  type: Array<'Airplain' | 'Sea' | 'Train'>;
  products: Product[],
  status: string;
  delivery_date: string;
  note?: string;
}