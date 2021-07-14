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

export const addCustomer = async (req, res) => {
  let customer = {
    ico: req.body.ico,
    name: req.body.jmenoFirmy,
    created: { by: req.user._id },
    persons: [],
  };
  if (req.body.persons)
    req.body.persons.forEach((el) => {
      const contact = {
        name: el.jmeno,
        surname: el.prijmeni,
        job: el.funkce,
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
  try {
    await Customer.deleteOne({ _id: req.params.customerID });
    res.status(204).json({ message: 'Zákazník byl smazán' });
  } catch (err) {
    res.json({ message: err }).status(404);
  }
};
