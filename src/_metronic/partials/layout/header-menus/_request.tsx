import axios from 'axios'
import { AlertModel } from './HeaderNotificationsMenu'

const API_URL = import.meta.env.VITE_APP_API_URL
const NOTIFICATION_ENDPOINT = `${API_URL}/notifications`

export const getNotifications = () => {
  return axios.get(NOTIFICATION_ENDPOINT)
}

export const createNotification = (notification: AlertModel) => {
  return axios.post(NOTIFICATION_ENDPOINT, notification);
}

export const updateNotifications = (id: number, notification: AlertModel) => {
  return axios.put(`${NOTIFICATION_ENDPOINT}/${id}`, notification);
}