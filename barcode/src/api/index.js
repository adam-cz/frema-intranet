import axios from 'axios';

const api = 'http://localhost:3001/';

export const verifyCardId = (id) => axios.get(`${api}barcode/user/${id}`);
