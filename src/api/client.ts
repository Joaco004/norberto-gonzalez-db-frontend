import axios from 'axios';

const client = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
})

client.interceptors.request.use((config) => {
    const auth = localStorage.getItem('auth')

    if (auth) {
        const { token } = JSON.parse(auth)
        config.headers.Authorization = `Bearer ${token}`
    }

    return config
})

export default client;