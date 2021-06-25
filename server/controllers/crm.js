import CRM from '../models/crm.js';
import Employees from '../models/user.js';
import Customers from '../models/customer.js';

export const fetchCrmRecords = async (req, res) => {
  try {
    const data = await CRM.find().lean();
    const newData = data.map((item) => ({ ...item, key: item._id }));
    res.json(newData).status(200);
  } catch (err) {
    res.json({ message: err }).status(401);
  }
};

export const addCrmText = async (req, res) => {
  try {
    const employee = await Employees.findOne({ Email: req.user.username });
    const crmRecord = await CRM.findOne({ _id: req.body.id });
    crmRecord.coms.phone.done = req.body.phone;
    crmRecord.coms.email.done = req.body.email;
    crmRecord.coms.visit.done = req.body.visit;
    crmRecord.coms.order.done = req.body.order;
    crmRecord.records.push({
      text: req.body.text,
      created: { id: employee._id },
    });
    await crmRecord.save();
    res.status(200).json({ message: 'Záznam byl přidán' });
  } catch (error) {
    res.json({ message: err }).status(401);
  }
};

export const addCrmRecord = async (req, res) => {
  let record = {
    client: {
      company_id: req.body.company,
      person_id: req.body.contact,
    },
    subject: req.body.predmetNabidky,
    value: req.body.hodnotaNabidky,
    coms: {
      phone: { done: req.body.comsPhone },
      email: { done: req.body.comsEmail },
      visit: { done: req.body.comsVisit },
      order: { done: req.body.comsOrder },
    },
    records: [{ text: req.body.recordText, created: { id: '' } }],
    created: { id: '' },
  };

  try {
    const customer = await Customers.findOne({
      _id: req.body.company,
    });
    const employee = await Employees.findOne({ Email: req.user.username });
    record.client.company_name = customer.name;
    record.records[0].created.id = employee._id;
    record.created.name = `${employee.Jmeno} ${employee.Prijmeni}`;
    record.created.id = employee._id;
    CRM.create(record);
    res.status(200).json({ message: 'Záznam byl vytvořen' });
  } catch (err) {
    res.json({ message: err }).status(401);
  }
};
