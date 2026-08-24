import axios from 'axios'


export const axiosInstance = axios.create({
  baseURL:'https://chatsystem-backend-ocwv.onrender.com/api',
  withCredentials: true,
})