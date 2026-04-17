import axios from 'axios';

const client = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
})

client.interceptors.request.use((config) => {
    const auth = localStorage.getItem('auth')

    if (auth) {
        const { state } = JSON.parse(auth)
        if (state?.token){
            config.headers.Authorization = `Bearer ${state.token}`
        }
    }

    return config
})

export default client;