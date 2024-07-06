import axios from "axios";

const API_URL = import.meta.env.VITE_APP_API_URL
const ORDERS_ENDPOINT = `${API_URL}/orders`

export const getAllOrders = (page: number, limit = 50) => {
  return axios
    .get(ORDERS_ENDPOINT, {
      params: { page: page, items_per_page: limit }
    })
}

export const getOrderAmout = () => {
  return axios.get(`${API_URL}/orders/count`)
}
