import axios from "axios";

const API_URL = import.meta.env.VITE_APP_API_URL
const ORDERS_ENDPOINT = `${API_URL}/orders`

const getAllOrders = (page, limit = 50) => {
    return axios
        .get(ORDERS_ENDPOINT, { page: page, items_per_page: limit })
}

export {
    getAllOrders,
}