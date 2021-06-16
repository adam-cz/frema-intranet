import CRM from '../models/crm.js';

export const fetchCrmRecords = async (req, res) => {
  const data = await CRM.find();
  try {
    res.json(data).status(200);
  } catch (err) {
    res.json({ message: err }).status(401);
  }
};

export const addCrmRecord = async (req, res) => {
  console.log(req.data);
};
