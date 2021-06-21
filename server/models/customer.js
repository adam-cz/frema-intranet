import mongoose from 'mongoose';

const customerSchema = mongoose.Schema({
  ico: Number,
  name: String,
  created: {
    by: String,
    date: { type: Date, default: new Date(Date.now()) },
  },
  persons: [
    {
      name: String,
      surname: String,
      job: String,
      tel: String,
      mail: String,
      created: {
        by: String,
        date: { type: Date, default: new Date(Date.now()) },
      },
    },
  ],
});

const Customer = mongoose.model('customer', customerSchema);

export default Customer;
