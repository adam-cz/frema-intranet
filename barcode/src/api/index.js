import axios from 'axios';

const api = 'http://localhost:3001/';

export const verifyCardId = (id) => axios.get(`${api}barcode/user/${id}`);
export const setProces = (barcode, user) =>
  axios.post(`${api}barcode/operace`, { barcode, user });
