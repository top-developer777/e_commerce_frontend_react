import axios from "axios";

const API_URL = import.meta.env.VITE_APP_API_URL
const PRODUCTS_ENDPOINT = `${API_URL}/products`
const SUPPLIERS_ENDPOINT = `${API_URL}/products`

const getAllProducts = (page, limit=50) => {
    return axios
        .get(PRODUCTS_ENDPOINT, {page: page, items_per_page: limit})
}

const getAllSuppliers = (page, limit=50) => {
    return axios
        .get(SUPPLIERS_ENDPOINT, {page: page, items_per_page: limit})
}

export {
    getAllProducts,
    getAllSuppliers
}