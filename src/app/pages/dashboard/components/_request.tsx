import axios from "axios";

const API_URL = import.meta.env.VITE_APP_API_URL
const DASHBOARD_ENDPOINT = `${API_URL}/dashboard`

const getDashboardInfo = () => {
    return axios
        .get(`${DASHBOARD_ENDPOINT}/tiles`)
}

const getChartInfo = (type: number, productIds: string = '') => {
    return axios
        .get(`${DASHBOARD_ENDPOINT}/chart?type=${type}${productIds ? `&product_ids=${productIds}` : ''}`)
}

const getProductsDay = (day: string) => {
    return axios
        .post(`${DASHBOARD_ENDPOINT}/days`, {day: day})
}

export {
    getDashboardInfo,
    getProductsDay,
    getChartInfo
}