import axios from "axios";
const API_URL = import.meta.env.VITE_APP_API_URL
const EMAG_ENDPOINT = `${API_URL}/awb`

export const getEmagOrders = () => {
  return axios.get(`${EMAG_ENDPOINT}/orders`);
}

export const generateAWB = (order_id: number, observation_field: string) => {
  return axios.post(`${EMAG_ENDPOINT}/awb`, { params: { order_id, observation_field }})
}
