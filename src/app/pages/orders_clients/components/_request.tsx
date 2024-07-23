import axios from "axios";

const API_URL = import.meta.env.VITE_APP_API_URL
const ORDERS_ENDPOINT = `${API_URL}/orders`

export const getAllOrders = (page: number, limit = 50, status = -1, searchText = '') => {
  return axios
    .get(ORDERS_ENDPOINT, {
      params: { page: page, items_per_page: limit, status: status, search_text: searchText }
    })
}

export const getOrderAmout = (status = -1, searchText = '') => {
  return axios.get(`${API_URL}/orders/count`, {
    params: { status: status, search_text: searchText }
  })
}

export const getAllReplaces = (page: number, limit = 50, status = -1) => {
  return axios
    .get(`${API_URL}/replaces`, {
      params: { page: page, items_per_page: limit, status: status }
    })
}

export const getReplaceAmount = (status = -1) => {
  return axios.get(`${API_URL}/replaces/count`, {
    params: { status: status }
  })
}

export const getAllReturns = () => {
  return axios.get(`${API_URL}/returns`)
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const saveBarcode = (code: number) => {
  return axios.get(`${API_URL}/replaces`)
}

export const createAWB = (data: {
  cod: number,
  envelope_number: number,
  is_oversize: boolean,
  order_id: number,
  parcel_number: number,
  locker_id: number,
  rma_id: number,
  insured_value: number,
  observation: string,
  courier_account_id: number,
  pickup_and_return: boolean,
  saturday_delivery: boolean,
  sameday_delivery: boolean,
  dropoff_locker: boolean,
  receiver_contact: string,
  receiver_legal_entity: boolean,
  receiver_locality_id: number,
  receiver_name: string,
  receiver_phone1: string,
  receiver_street: string,
  receiver_zipcode: string,
  sender_locality_id: number,
  sender_name: string,
  sender_phone1: string,
  sender_street: string,
  sender_zipcode: string,
}, marketplace: string) => {
  return axios.post(`${API_URL}/../awb?marketplace=${marketplace}`, data)
}
