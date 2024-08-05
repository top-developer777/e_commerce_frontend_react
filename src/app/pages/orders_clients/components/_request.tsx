import axios from "axios";
import { AWBInterface } from "../../models/awb";

const API_URL = import.meta.env.VITE_APP_API_URL
const ORDERS_ENDPOINT = `${API_URL}/orders`;
const COURIER_ENDPOINT = `${API_URL}/courier`;

export const getAllOrders = (page: number, limit = 50, status = -1, searchText = '', sort = true) => {
  return axios
    .get(ORDERS_ENDPOINT, {
      params: { page: page, items_per_page: limit, status: status, search_text: searchText, flag: sort }
    })
}

export const getOrderAmout = (status = -1, searchText = '') => {
  return axios.get(`${API_URL}/orders/count`, {
    params: { status: status, search_text: searchText }
  })
}

export const getNewOrderAmount = () => {
  return axios.get(`${API_URL}/orders/count/new_order`, {
    params: { search_text: '' }
  })
}

export const getAWBByOrderID = (id: number) => {
  return axios.get(`${API_URL}/../awb/order_id`, { params: { order_id: id } });
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

export const createAWB = (data: AWBInterface, marketplace: string) => {
  return axios.post(`${API_URL}/../awb?marketplace=${marketplace}`, data)
}

export const getCustomer = async (orderId: number) => {
  return axios.get(`${API_URL}/../awb/customer?order_id=${orderId}`)
}

export const getCouriers = async (page: number = 1, limit: number = 50) => {
  return axios.get(COURIER_ENDPOINT, { params: { page, limit }})
}

export const getNewOrders = async () => {
  return axios.get(`${ORDERS_ENDPOINT}/new_order`, { params: { flag: false, search_text: '' } });
}
