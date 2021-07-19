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
export const signUp = (id, email, password) =>
  axios.post(`${urlAuth}user/signup`, id, email, password);

//API calls
//CRM
export const fetchCrmRecords = () => axios.get(`${urlApi}obchod/crm/`);
export const addCrmRecord = (values) =>
  axios.post(`${urlApi}obchod/crm/`, values);
export const deleteCrmRecord = (recordID) =>
  axios.delete(`${urlApi}obchod/crm/${recordID}`);
export const editCrmRecord = (values) =>
  axios.put(`${urlApi}obchod/crm/`, values);

//CRM record texts
export const addCrmText = (values) =>
  axios.post(`${urlApi}obchod/crm/text`, values);

//Customers
export const fetchCustomers = () => axios.get(`${urlApi}obchod/customers/`);
export const addCustomer = (values) =>
  axios.post(`${urlApi}obchod/customers/`, values);
export const editCustomer = (values) =>
  axios.put(`${urlApi}obchod/customers/`, values);
export const deleteCustomer = (id) =>
  axios.delete(`${urlApi}obchod/customers/${id}`);

//Customer contacts
export const editPerson = (person, customerID) =>
  axios.put(`${urlApi}obchod/customers/person`, { person, customerID });
export const deletePerson = (personID, customerID) =>
  axios.delete(`${urlApi}obchod/customers/person`, {
    data: { personID, customerID },
  });

//Employees
export const fetchEmployees = () => axios.get(`${urlApi}zamestnanci/`);
