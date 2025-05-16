// src/utils/baseUrl.js
const baseURL =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:8080/api/v1' // or your actual local IP/server
    : process.env.NEXT_PUBLIC_API_BASE_URL || 'https://pspweb-backend.onrender.com/api/v1'; // fallback for prod

export default baseURL;
