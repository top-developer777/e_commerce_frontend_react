import axios from "axios";

const API_URL = import.meta.env.VITE_APP_API_URL
const MARKETPLACE_ENDPOINT = `${API_URL}/marketplace`
const UPLOAD_ENDPOINT = `${API_URL}/utils/upload`

const createMarketplace = (data) => {
    return axios
        .post(MARKETPLACE_ENDPOINT, data)
        .then((response) => response.data)
}

const getAllMarketplaces = () => {
    return axios
        .get(MARKETPLACE_ENDPOINT, {limit: 1000})
}

const removeMarketplace = (id) => {
    return axios
        .delete(`${MARKETPLACE_ENDPOINT}/${id}`)
}

const uploadImage = (data) => {
    return axios.post(UPLOAD_ENDPOINT, data, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    }).then(res => res.data)
}

export {
    createMarketplace,
    uploadImage,
    getAllMarketplaces,
    removeMarketplace
}