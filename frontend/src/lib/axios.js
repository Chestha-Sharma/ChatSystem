import axios from 'axios'


export const axiosInstance = axios.create({
  baseURL:
  import.meta.env.NODE_ENV === 'development' ?
   'http://localhost:5001/api'
   : 'https://chatsystem-n8qp.onrender.com/api',
  withCredentials: true,
})