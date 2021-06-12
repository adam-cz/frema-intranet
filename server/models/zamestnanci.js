import mongoose from 'mongoose';

const employeesSchema = mongoose.Schema({
  Jmeno: String,
  Prijmeni: String,
  Email: String,
  Heslo: String,
  Pritomen: Boolean,
  DatumCasOperace: Date,
  RC: Number,
});

const Employees = mongoose.model('Employee', employeesSchema);

export default Employees;
