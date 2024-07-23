import axios from "axios";

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

const getAllProducts = (page: number, limit: number = 50, suppliers: string = '') => {
    return axios
        .get(`${API_URL}/products`, {
            params: { page: page, items_per_page: limit, supplier_ids: suppliers }
        })
}

const getProductAmount = (suppliers: string = '') => {
    return axios.get(`${API_URL}/products/count?supplier_ids=${suppliers}`)
}

const getProductInfo = async (ean: string, type: number = 1) => {
    return axios.get(`${API_URL}/products/info/${ean}?type=${type}`)
}

export {
    getAllProducts,
    getChartInfo,
    getDashboardInfo,
    getPLInfo,
    getProductAmount,
    getProductsDay,
    getProductInfo,
    getTrendInfo,
}