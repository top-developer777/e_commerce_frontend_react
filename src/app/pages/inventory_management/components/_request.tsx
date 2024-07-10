import axios from "axios";

const API_URL = import.meta.env.VITE_APP_API_URL
const PRODUCTS_ENDPOINT = `${API_URL}/products`
const SUPPLIERS_ENDPOINT = `${API_URL}/suppliers`
const SHIPMENT_ENDPOINT = `${API_URL}/inventory/shipment`

export const getAllProducts = () => {
    return axios
        .get(`${API_URL}/inventory/product`)
}

export const getFilteredProducts = (shipment_type: string, weight_min: number, weight_max: number, volumetric_weight_min: number, volumetric_weight_max: number) => {
    let url = `${API_URL}/inventory/product/advance?shipment_type=${shipment_type}`;
    if (weight_min) url += `&weight_min=${weight_min}`;
    if (weight_max) url += `&weight_max=${weight_max}`;
    if (volumetric_weight_min) url += `&volumetric_weight_min=${volumetric_weight_min}`;
    if (volumetric_weight_max) url += `&volumetric_weight_max=${volumetric_weight_max}`;
    return axios.get(url);
}

export const addProductRequest = (data: { [key: string]: string | number | boolean }) => {
    return axios.post(PRODUCTS_ENDPOINT, data)
}

export const editProductRequest = (id: number, data: { [key: string]: string | number | boolean }) => {
    return axios.put(`${PRODUCTS_ENDPOINT}/${id}`, data);
}

export const getProductByID = (id: number) => {
    return axios
        .get(`${PRODUCTS_ENDPOINT}/${id}`)
}

export const getProductImageByID = async (id: number) => {
    const response = await axios.get(`${PRODUCTS_ENDPOINT}/${id}`);
    const images = JSON.parse(response.data.images);
    return images.length > 0 ? images[0]["url"] : [{ "url": "" }]
}

export const getAllSuppliers = (page: number, limit = 50) => {
    return axios
        .get(SUPPLIERS_ENDPOINT, { params: { page: page, items_per_page: limit } })
}

export const countSuppliers = () => {
    return axios.get(`${SUPPLIERS_ENDPOINT}/count`);
}

export const getShipments = () => {
    return axios.get(`${SHIPMENT_ENDPOINT}`)
}

export const createShipments = (data: { [key: string]: string | number | boolean }) => {
    return axios.post(`${SHIPMENT_ENDPOINT}`, data);
}

export const updateShipments = (data: { [key: string]: string | number | boolean }) => {
    return axios.put(`${SHIPMENT_ENDPOINT}`, data);
}
