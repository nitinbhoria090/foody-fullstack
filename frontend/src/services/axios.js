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


const BASE_URL =process.env.VITE_APP_API_URL;

const API = axios.create({
  
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
