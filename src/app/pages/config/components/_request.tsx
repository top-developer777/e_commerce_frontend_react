import axios from "axios";

interface TeamMember {
    id?: number
    user_id: number
    username: string
    email: string
    full_name: string
    role: number
    created_at: string
    updated_at: string
    last_logged_in: string
    hashed_password: string
}

const API_URL = import.meta.env.VITE_APP_API_URL
const MARKETPLACE_ENDPOINT = `${API_URL}/marketplace`
const UPLOAD_ENDPOINT = `${API_URL}/utils/upload`
const TEAM_ENDPOINT = `${API_URL}/team_member`

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

const getUsers = async () => {
    return axios.get(`${API_URL}/users?page=1&items_per_page=100`);
}

const getTeamMembers = async () => {
    return axios.get(TEAM_ENDPOINT)
}

const addTeamMember = async (data: TeamMember) => {
    return axios.post(TEAM_ENDPOINT, data);
}

const editTeamMember = async (id: number, data: TeamMember) => {
    return axios.put(`${TEAM_ENDPOINT}/${id}`, data);
}

const deleteTeamMember = async (id: number) => {
    return axios.delete(`${TEAM_ENDPOINT}/${id}`);
}

export {
    createMarketplace,
    editMarketplace,
    getAllMarketplaces,
    getTeamMembers,
    addTeamMember,
    getUsers,
    editTeamMember,
    deleteTeamMember,
    removeMarketplace,
    uploadImage,
}