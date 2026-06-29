import axios from 'axios'


export const axiosInstance = axios.create({
  baseURL:'https://chatsystem-n8qp.onrender.com/api',
  withCredentials: true,
})