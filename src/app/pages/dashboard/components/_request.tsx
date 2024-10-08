import axios from "axios";
import { WarehouseType } from "../../models/warehouse";

const API_URL = import.meta.env.VITE_APP_API_URL
const DASHBOARD_ENDPOINT = `${API_URL}/dashboard`

const getDashboardInfo = () => {
    return axios
        .get(`${DASHBOARD_ENDPOINT}/tiles`)
}

const getChartInfo = (type: number = 1, productIds: string = '') => {
    return axios
        .get(`${DASHBOARD_ENDPOINT}/chart?type=${type}${productIds ? `&product_ids=${productIds}` : ''}`)
}

const getPLInfo = (type: number = 1, productIds: string = '') => {
    return axios
        .get(`${DASHBOARD_ENDPOINT}/P_L?type=${type}${productIds ? `&product_ids=${productIds}` : ''}`)
}

const getTrendInfo = (type: number = 1, field: string = 'sales', productIds: string = '') => {
    return axios
        .get(`${DASHBOARD_ENDPOINT}/trends?type=${type}&field=${field}${productIds ? `&product_ids=${productIds}` : ''}`)
}

const getProductsDay = (day: string) => {
    return axios
        .post(`${DASHBOARD_ENDPOINT}/days`, {day: day})
}

const getAllProducts = (page: number, limit: number = 50, suppliers: string = '', filter: string = '') => {
    return axios
        .get(`${API_URL}/internal_products`, {
            params: { page: page, items_per_page: limit, supplier_ids: suppliers, search_text: filter }
        })
}

const getProductAmount = (suppliers: string = '') => {
    return axios.get(`${API_URL}/internal_products/count?supplier_ids=${suppliers}`)
}

const getProductInfo = async (ean: string, type: number = 1) => {
    return axios.get(`${API_URL}/internal_products/info/${ean}?type=${type}`)
}

const deleteProduct = async (id: number) => {
    return axios.delete(`${API_URL}/internal_products/${id}`)
}

const getWarehouses = async () => {
    return axios.get(`${API_URL}/warehouse`)
}

const getWarehouse = async (id: number) => {
    return axios.get(`${API_URL}/warehouse/${id}`)
}

const createWarehouse = async (data: WarehouseType) => {
    return axios.post(`${API_URL}/warehouse`, data)
}

const updateWarehouse = async (id: number, data: WarehouseType) => {
    return axios.put(`${API_URL}/warehouse/${id}`, data)
}

const deleteWarehouse = async (id: number) => {
    return axios.delete(`${API_URL}/warehouse/${id}`)
}

export {
    getAllProducts,
    getChartInfo,
    getDashboardInfo,
    getPLInfo,
    getProductAmount,
    getProductsDay,
    deleteProduct,
    getProductInfo,
    getTrendInfo,
    createWarehouse,
    getWarehouses,
    getWarehouse,
    updateWarehouse,
    deleteWarehouse,
}