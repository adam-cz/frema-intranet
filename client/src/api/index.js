import axios from 'axios';

const appSite = 'http://localhost';
const urlApi = `${appSite}:3001/`;
const urlAuth = `${appSite}:3002/`;

axios.defaults.withCredentials = true;

export const silentRefresh = (time) => {
  setTimeout(() => {
    axios.post(`${urlAuth}user/token`).then((res) => {
      if (res.status === 200) silentRefresh(res.data.expiresIn);
    });
  }, time);
};
export const silentLogin = () => axios.post(`${urlAuth}user/token`);
export const login = (email, password) =>
  axios.post(`${urlAuth}user/signin`, { email, password });
export const logout = () => axios.delete(`${urlAuth}user/signout`);

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
