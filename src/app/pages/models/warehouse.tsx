export interface WarehouseType {
  id?: number;
  name: string;
  sender_name: string;
  sender_contact: string;
  phone1: string;
  phone2?: string;
  legal_entity: boolean;
  locality_id: string;
  street: string;
  zipcode: string;
}