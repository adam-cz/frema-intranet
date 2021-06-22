import CRM from '../models/crm.js';
import Employees from '../models/user.js';

export const fetchCrmRecords = async (req, res) => {
  try {
    let data = await CRM.find();
    res.json(data).status(200);
  } catch (err) {
    res.json({ message: err }).status(401);
  }
};

export const addCrmRecord = async (req, res) => {
  let record = req.body;
  try {
    const { _id } = await Employees.findOne({ Email: req.user.username });
    record.records[0].created.id = _id;
    record.created.id = _id;
    CRM.create(record);
    res.status(200).json({ message: 'Zákazník byl vytvořen' });
  } catch (err) {
    res.json({ message: err }).status(401);
  }
};
