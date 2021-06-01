import mongoose from 'mongoose';

// Edit _itemSchema and _Item var

const employeesSchema = mongoose.Schema({
  name: String,
  surname: String,
  present: Boolean,
});

const Employees = mongoose.model('Employee', employeesSchema);

export default Employees;
