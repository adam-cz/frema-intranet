import axios from 'axios';

const urlApi = 'http://localhost:3001/';
const urlAuth = 'http://localhost:3002/';

axios.defaults.withCredentials = true;

// axios.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   (error) => {
//     const originalRequest = error.config;
//     if (error.response.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;
//       return axios.post(`${urlAuth}user/token`).then((req, res) => {
//         console.log(req, res);
//         if (res.status === 201) {
//           return axios(originalRequest);
//         }
//       });
//     }
//     return Promise.reject(error);
//   }
// );

//User calls

export const silentRefresh = (time) => {
  setTimeout(() => {
    axios.post(`${urlAuth}user/token`).then((res) => {
      if (res.status === 200) silentRefresh(res.data.expiresIn);
    });
  }, time);
};
export const silentLogin = () => axios.post(`${urlAuth}user/token`);
export const login = (email, heslo) =>
  axios.post(`${urlAuth}user/signin`, { email, heslo });

//API calls
//CRM
export const fetchCrmRecords = () => axios.get(`${urlApi}crm/`);
export const addCrmRecord = (values) => axios.post(`${urlApi}crm/add`, values);
export const addCrmText = (values) =>
  axios.post(`${urlApi}crm/addtext`, values);
//Customers
export const fetchCustomers = () => axios.get(`${urlApi}crm/customers/`);
export const addCustomer = (values) =>
  axios.post(`${urlApi}crm/customers/add/`, values);

//Employees
export const fetchEmployees = () => axios.get(`${urlApi}zamestnanci/`);
