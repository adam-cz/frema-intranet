import Customer from '../models/customer.js';

export const fetchCustomers = async (req, res) => {
  const data = await Customer.find().lean();
  const newData = data.map((item) => ({ ...item, key: item._id }));
  try {
    res.json(newData).status(200);
  } catch (err) {
    res.json({ message: err }).status(401);
  }
};

export const editCustomer = async (req, res) => {
  try {
    const customer = await Customer.findOne({ _id: req.body._id });
    customer.name = req.body.name;
    customer.ico = req.body.ico;
    customer.persons = req.body.persons;
    await customer.save();
    res.status(201).json({ message: 'Zákazník byl vytvořen' });
  } catch (err) {
    res.json({ message: err }).status(404);
  }
};

export const addCustomer = async (req, res) => {
  let customer = {
    ico: req.body.ico,
    name: req.body.name,
    created: { by: req.user._id },
    persons: [],
  };
  if (req.body.persons)
    req.body.persons.forEach((el) => {
      const contact = {
        name: el.name,
        surname: el.surname,
        job: el.job,
        tel: el.tel,
        mail: el.mail,
        created: { by: req.user._id },
      };

      customer.persons.push(contact);
    });
  try {
    const customerExists = await Customer.findOne({ ico: customer.ico });
    if (customerExists)
      return res.status(409).json({ message: 'Zákazník již existuje' });
    await Customer.create(customer);
    res.status(201).json({ message: 'Zákazník byl vytvořen' });
  } catch (err) {
    res.status(401).json({ message: err });
    console.log(err);
  }
};

export const deleteCustomer = async (req, res) => {
  console.log(req.params.customerID);
  try {
    await Customer.deleteOne({ _id: req.params.customerID });
    res.status(204).json({ message: 'Zákazník byl smazán' });
  } catch (err) {
    res.json({ message: err }).status(404);
  }
};

export const editCustomerPerson = async (req, res) => {
  try {
    const customer = await Customer.findOneAndUpdate(
      { _id: req.body.customerID, 'persons._id': req.body.person._id },
      { $set: { 'persons.$': req.body.person } }
    );
    customer.save();
    res.status(201).json({ message: 'Kontakt byl změněn' });
  } catch (err) {
    res.json({ message: err }).status(404);
  }
};

export const deleteCustomerPerson = async (req, res) => {
  try {
    const customer = await Customer.findOne({ _id: req.body.customerID });
    await customer.persons.pull({ _id: req.body.personID });
    await customer.save();
    console.log(customer);
    res.status(204).json({ message: 'Osoba byla smazána' });
  } catch (err) {
    res.json({ message: err }).status(404);
  }
};

export const createCustomerPerson = async (req, res) => {
  try {
    const person = req.body.person;
    const customer = await Customer.findOne({ _id: req.body.customerID });
    console.log(person, customer);
    res.status(201).json({ message: 'Zákazník byl Osoba byla přidána' });
  } catch (err) {
    res.json({ message: err }).status(404);
  }
};
