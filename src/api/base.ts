import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API|| 'http://localhost:3000';
const TOKEN = process.env.NEXT_PUBLIC_TOKEN


const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${TOKEN}`,
  },
})
export default api;