import axios from 'axios';

const api = process.env.REACT_APP_API_URL;

axios.defaults.withCredentials = true;

export const silentRefresh = (time) => {
  setTimeout(() => {
    axios.post(`${api}user/token`).then((res) => {
      if (res.status === 200) silentRefresh(res.data.expiresIn);
    });
  }, time);
};
export const silentLogin = () => axios.post(`${api}user/token`);
export const login = (email, password) =>
  axios.post(`${api}user/signin`, { email, password });
export const logout = () => axios.delete(`${api}user/signout`);
export const signUp = (id, email, password) =>
  axios.post(`${api}user/signup`, id, email, password);

//API calls
//CRM
export const fetchCrmRecords = () => axios.get(`${api}obchod/crm/`);
export const addCrmRecord = (values) => axios.post(`${api}obchod/crm/`, values);
export const deleteCrmRecord = (recordID) =>
  axios.delete(`${api}obchod/crm/${recordID}`);
export const editCrmRecord = (values) => axios.put(`${api}obchod/crm/`, values);

//CRM record texts
export const addCrmText = (values) =>
  axios.post(`${api}obchod/crm/text`, values);

//Customers
export const fetchCustomers = () => axios.get(`${api}obchod/customers/`);
export const addCustomer = (values) =>
  axios.post(`${api}obchod/customers/`, values);
export const editCustomer = (values) =>
  axios.put(`${api}obchod/customers/`, values);
export const deleteCustomer = (id) =>
  axios.delete(`${api}obchod/customers/${id}`);

//Customer contacts
export const editPerson = (person, customerID) =>
  axios.put(`${api}obchod/customers/person`, { person, customerID });
export const deletePerson = (personID, customerID) =>
  axios.delete(`${api}obchod/customers/person`, {
    data: { personID, customerID },
  });

//Employees
export const fetchEmployees = () => axios.get(`${api}zamestnanci/`);

//Orders
export const fetchOrders = () => axios.get(`${api}vyhodnoceni/objednavky`);
export const getOrderNumber = (final) =>
  axios.get(`${api}vyhodnoceni/opt/${final}`);
export const fetchFinals = () => axios.get(`${api}vyhodnoceni/finaly`);
export const fetchOpvs = () => axios.get(`${api}vyhodnoceni/opv`);
export const fetchOperace = (order) =>
  axios.get(`${api}vyhodnoceni/operace/${order}`);
export const createProcedure = (procedures) =>
  axios.post(`${api}vyhodnoceni/create`, procedures);
export const fetchOpvList = (objednavka) =>
  axios.get(`${api}vyhodnoceni/opv/${objednavka}`);

//Vykazy
export const nacistVykazy = (datumOd, datumDo, uzivatelId) =>
  axios.post(`${api}vykazy/`, { datumOd, datumDo, uzivatelId });
export const smazatVykazy = (procesId, startId, StopId) =>
  axios.delete(`${api}vykazy/smazat`, { data: { procesId, startId, StopId } });
