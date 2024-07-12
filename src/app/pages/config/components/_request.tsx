import axios from "axios";

const API_URL = import.meta.env.VITE_APP_API_URL
const MARKETPLACE_ENDPOINT = `${API_URL}/marketplace`
const UPLOAD_ENDPOINT = `${API_URL}/utils/upload`

const createMarketplace = async (data: object) => {
    return axios
        .post(MARKETPLACE_ENDPOINT, data)
        .then((response) => response.data)
}

const getAllMarketplaces = async () => {
    return axios
        .get(MARKETPLACE_ENDPOINT, { params: { limit: 1000 } })
}

const editMarketplace = async (id: number, data: object) => {
    return axios
        .put(`${MARKETPLACE_ENDPOINT}/${id}`, data)
}

const removeMarketplace = async (id: number) => {
    return axios
        .delete(`${MARKETPLACE_ENDPOINT}/${id}`)
}

const uploadImage = async (data: object) => {
    return axios.post(UPLOAD_ENDPOINT, data, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    }).then(res => res.data)
}

export {
    createMarketplace,
    editMarketplace,
    getAllMarketplaces,
    removeMarketplace,
    uploadImage,
}