import axios from 'axios';

const url = 'http://localhost:3001/';

export const fetchEmployees = () => axios.get(`${url}zamestnanci/`);
