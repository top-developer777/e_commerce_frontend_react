import { Order } from '../../models/order'

export interface DashboardInfo {
  title: string;
  date_range: string;
  total_units: string;
  total_sales: string;
  total_refund: string;
  total_ads: string;
  total_payout: string;
  total_gross_profit: string;
  total_net_profit: string;
  total_orders: string;
  orders: Order[];
}