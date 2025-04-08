import axios from 'axios'

export const axiosInstance = axios.create({
baseURL:"http://localhost:5010",
withCredentials: true,
})