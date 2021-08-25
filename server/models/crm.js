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
      date: { type: Date, default: Date.now() },
    },
    email: {
      done: { type: Boolean, default: false },
      date: { type: Date, default: Date.now() },
    },
    visit: {
      done: { type: Boolean, default: false },
      date: { type: Date, default: Date.now() },
    },
    order: {
      done: { type: Boolean, default: false },
      date: { type: Date, default: Date.now() },
    },
  },
  records: [
    {
      created: {
        date: { type: Date, default: Date.now() },
        id: Number,
      },

      text: String,
    },
  ],
  created: {
    date: { type: Date, default: Date.now() },
    id: Number,
    name: String,
  },
});

const CRM = mongoose.model('crm', crmSchema);

export default CRM;
