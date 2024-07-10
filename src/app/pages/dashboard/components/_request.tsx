import axios from "axios";

const API_URL = import.meta.env.VITE_APP_API_URL
const DASHBOARD_ENDPOINT = `${API_URL}/dashboard`

type Query = {
    page: number,
    supplier_ids?: string,
    limit?: number,
    data: never[],
}

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

const getProductsDay = (day: string) => {
    return axios
        .post(`${DASHBOARD_ENDPOINT}/days`, {day: day})
}

const getAllProducts = (page: number, limit: number = 50, suppliers: string = ''): Promise<Query> => {
    const query: Query = {
        page: page,
        supplier_ids: suppliers,
        limit: limit,
        data: []
    }
    return axios
        .get(`${API_URL}/products`, {
            params: query
        })
}

const getProductAmount = (suppliers: string = '') => {
    return axios.get(`${API_URL}/products/count?supplier_ids=${suppliers}`)
}

export {
    getDashboardInfo,
    getProductsDay,
    getChartInfo,
    getPLInfo,
    getAllProducts,
    getProductAmount,
}