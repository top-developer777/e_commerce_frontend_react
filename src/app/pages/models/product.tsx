export interface Product {
  id?: number;
  part_number_key: string;
  product_name: string;
  model_name: string;
  ean: string;
  price: string;
  image_link: string;
  barcode_title: string;
  masterbox_title: string;
  link_address_1688: string;
  price_1688: string;
  variation_name_1688: string;
  pcs_ctn: string;
  weight: number;
  volumetric_weight: number;
  dimensions: string;
  supplier_id: number;
  english_name: string;
  romanian_name: string;
  material_name_en: string;
  material_name_ro: string;
  hs_code: string;
  battery: boolean;
  default_usage: string;
  production_time: string;
  discontinued: boolean;
  stock: number;
  day_stock: number[];
  internal_shipping_price: string;
  market_place?: string[];
  sale_price?: string;
  observation?: string;
  warehouse_id?: number;
}