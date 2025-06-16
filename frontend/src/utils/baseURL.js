const baseURL = import.meta.env.PROD
  // ? 'https://pspweb-backend.onrender.com/api/v1'
  // : 'https://pspweb-backend.onrender.com/api/v1';
  ? 'http://localhost:8080/api/v1'
  : 'http://localhost:8080/api/v1';
export default baseURL;
