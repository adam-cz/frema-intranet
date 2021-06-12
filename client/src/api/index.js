import axios from 'axios';

const urlApi = 'http://localhost:3001/';
const urlAuth = 'http://localhost:3002/';

axios.interceptors.request.use(
  (config) => {
    const { origin } = new URL(config.url);
    const allowedOrigins = [urlApi];
    const token = localStorage.getItem('token');
    //if (allowedOrigins.includes(origin)) {
    config.headers.authorization = `Bearer ${token}`;
    //}
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const fetchEmployees = () => axios.post(`${urlApi}zamestnanci/`);

export const login = (email, heslo) =>
  axios.post(`${urlAuth}user/signin`, { email, heslo });
