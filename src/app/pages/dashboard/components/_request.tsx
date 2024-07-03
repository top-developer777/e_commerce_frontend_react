import axios from "axios";

const API_URL = import.meta.env.VITE_APP_API_URL
const DASHBOARD_ENDPOINT = `${API_URL}/dashboard`

const getDashboardInfo = () => {
    return axios
        .get(DASHBOARD_ENDPOINT)
}

const getProductsDay = (day: string) => {
    return axios
        .post(`${DASHBOARD_ENDPOINT}/days`, {day: day})
}

export {
    getDashboardInfo,
    getProductsDay
}