import Proces from '../models/proces.js';

export const fetchVykazy = (req, res) => {
  const vykazy = Proces.find();
};
