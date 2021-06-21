import Customer from '../models/customer.js';

export const fetchCustomers = async (req, res) => {
  const data = await Customer.find();
  try {
    res.json(data).status(200);
  } catch (err) {
    res.json({ message: err }).status(401);
  }
};

export const addCustomer = async (req, res) => {
  let customer = {
    ico: req.body.ico,
    name: req.body.jmenoFirmy,
    created: { by: req.user.username },
    persons: [],
  };
  if (req.body.persons)
    req.body.persons.forEach((el) => {
      const contact = {
        name: el.jmeno,
        surname: el.prijmeni,
        job: el.funkce,
        tel: el.tel,
        mail: el.tel,
        created: { by: req.user.username },
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
