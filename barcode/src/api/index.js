import axios from 'axios';

const api = process.env.REACT_APP_API_URL;

export const verifyCardId = (id) => axios.get(`${api}barcode/user/${id}`);
export const setProces = (barcode, user) =>
  axios.post(`${api}barcode/operace`, { barcode, user });
