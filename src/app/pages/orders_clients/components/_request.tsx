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
