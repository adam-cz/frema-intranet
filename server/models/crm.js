import mongoose from 'mongoose';

const crmSchema = mongoose.Schema({
  client: {
    company_id: String,
    company_name: String,
    person_id: String,
  },
  subject: String,
  value: Number,
  coms: {
    phone: {
      done: { type: Boolean, default: false },
      date: { type: Date, default: new Date(Date.now()) },
    },
    email: {
      done: { type: Boolean, default: false },
      date: { type: Date, default: new Date(Date.now()) },
    },
    visit: {
      done: { type: Boolean, default: false },
      date: { type: Date, default: new Date(Date.now()) },
    },
    order: {
      done: { type: Boolean, default: false },
      date: { type: Date, default: new Date(Date.now()) },
    },
  },
  records: [
    {
      created: {
        date: { type: Date, default: new Date(Date.now()) },
        id: String,
      },

      text: String,
    },
  ],
  created: {
    date: { type: Date, default: new Date(Date.now()) },
    id: String,
  },
});

const CRM = mongoose.model('crm', crmSchema);

export default CRM;
