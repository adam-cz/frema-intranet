import axios from 'axios';

const url = 'http://localhost:3001/';

export const getEmployees = () => axios.get(`${url}/zamestnanci`);
