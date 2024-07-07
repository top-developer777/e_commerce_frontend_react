import axios from "axios";

const API_URL = import.meta.env.VITE_APP_API_URL
const PRODUCTS_ENDPOINT = `${API_URL}/products`
const SUPPLIERS_ENDPOINT = `${API_URL}/products`

type Query = {
    page: number,
    supplier_ids?: string,
    limit?: number,
    data: never[],
}

const getAllProducts = (page: number, limit: number = 50, suppliers: string = ''): Promise<Query> => {
    const query: Query = {
        page: page,
        supplier_ids: suppliers,
        limit: limit,
        data: []
    }
    return axios
        .get(PRODUCTS_ENDPOINT, {
            params: query
        })
}

const addProductRequest = (data: { [key: string]: string | number | boolean }) => {
    console.log(data);
    return axios.post(PRODUCTS_ENDPOINT, data)
}

const editProductRequest = (id: number, data: { [key: string]: string | number | boolean }) => {
    console.log(id);
    console.log(data);
    return axios.put(`${PRODUCTS_ENDPOINT}/${id}`, data);
}

const getProductAmout = () => {
    return axios.get(`${API_URL}/products/count`)
}

const getAllSuppliers = (page: number, limit = 50) => {
    return axios
        .get(SUPPLIERS_ENDPOINT, { params: { page: page, items_per_page: limit } })
}

const getProductByID = (id: number) => {
    return axios
        .get(`${PRODUCTS_ENDPOINT}/${id}`)
}

const getProductImageByID = async (id: number) => {
    const response = await axios.get(`${PRODUCTS_ENDPOINT}/${id}`);
    const images = JSON.parse(response.data.images);
    return images.length > 0 ? images[0]["url"] : [{ "url": "" }]
}

export {
    addProductRequest,
    editProductRequest,
    getAllProducts,
    getAllSuppliers,
    getProductAmout,
    getProductByID,
    getProductImageByID,
}