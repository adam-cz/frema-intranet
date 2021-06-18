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
  console.log(req.body, req.user);
  Customer.create({
    ico: req.body.ico,
    name: req.body.jmenoFirmy,
    created: { by: req.user.username },
    req.body.persons
  });
};
