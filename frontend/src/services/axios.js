// import axios from "axios";

// const API = axios.create({
//     baseURL: "http://localhost:5000/api"
// });

// API.interceptors.request.use((config)=>{

//     const token = localStorage.getItem("token");

//     if(token){
//         config.headers.Authorization = `Bearer ${token}`;
//     }

//     return config;

// });

// export default API;

import axios from "axios";

// 1. Live aur Local donon URLs ko support karne ke liye environment variable setup karein
const BASE_URL = import.meta.env.VITE_APP_API_URL || process.env.VITE_APP_API_URL || "http://localhost:5000";

const API = axios.create({
    // 2. Base URL ke peeche automatically /api jod dega
    baseURL: `${BASE_URL}/api`
});

API.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

export default API;
