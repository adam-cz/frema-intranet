import mongoose from 'mongoose';

const employeesSchema = mongoose.Schema({
  Jmeno: String,
  Prijmeni: String,
  Pritomen: Boolean,
  RC: Number,
});

const Employees = mongoose.model('Employee', employeesSchema);

export default Employees;