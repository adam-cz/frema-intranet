import axios from 'axios';

const urlMerk = 'https://api.merk.cz/';

const fetchCompanyInfo = (company) =>
  axios.get(`${urlMerk}company`, {
    headers: { Authorization: `Bearer ${tokenStr}` },
  });
