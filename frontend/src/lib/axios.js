import axios from 'axios'


export const axiosInstance = axios.create({
  baseURL:
  import.meta.env.NODE_ENV === 'production' ?
    'https://chatsystem-n8qp.onrender.com/api'
    : 'http://localhost:5001/api',
  withCredentials: true,
})