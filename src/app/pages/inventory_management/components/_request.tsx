import axios from "axios";

const API_URL = import.meta.env.VITE_APP_API_URL
const PRODUCTS_ENDPOINT = `${API_URL}/products`
const SUPPLIERS_ENDPOINT = `${API_URL}/products`

type Query = {
    page: number,
    limit?: number
}

const getAllProducts = (page: number, limit=50) : Query => {
    const query: Query = {
        page: page,
        limit: limit
    }
    return axios
        .get(PRODUCTS_ENDPOINT, query)
}

const getAllSuppliers = (page: number, limit=50) => {
    return axios
        .get(SUPPLIERS_ENDPOINT, {page: page, items_per_page: limit})
}

const getProductByID = (id:number) => {
    return axios
        .get(`${PRODUCTS_ENDPOINT}/${id}`)
}

const getProductImageByID = async (id: number) => {
    let response = await axios.get(`${PRODUCTS_ENDPOINT}/${id}`)
    response = response.data
    return JSON.parse(response.images).length > 0 ? JSON.parse(response.images)[0]["url"] : [{"url": ""}]
}

export {
    getAllProducts,
    getAllSuppliers,
    getProductByID,
    getProductImageByID
}