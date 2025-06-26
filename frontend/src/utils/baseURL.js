const baseURL = import.meta.env.PROD
  // ? 'https://pspweb-backend.onrender.com/api/v1'
  // : 'https://pspweb-backend.onrender.com/api/v1';
  ? 'http://localhost:8000/api/v1'
  : 'http://localhost:8000/api/v1';
// const baseURL = 'http://192.168.100.108:8080/api/v1';

export default baseURL;
