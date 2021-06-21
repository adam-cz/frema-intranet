import mongoose from 'mongoose';

const crmSchema = mongoose.Schema({
  client: {
    ico: Number,
    person_id: String,
  },
  subject: String,
  value: Number,
  coms: {
    phone: {
      done: Boolean,
      date: { type: Date, default: new Date(Date.now()) },
    },
    email: {
      done: Boolean,
      date: { type: Date, default: new Date(Date.now()) },
    },
    visit: {
      done: Boolean,
      date: { type: Date, default: new Date(Date.now()) },
    },
    order: {
      done: Boolean,
      date: { type: Date, default: new Date(Date.now()) },
    },
  },
  records: [
    {
      created: {
        date: { type: Date, default: new Date(Date.now()) },
        id: Number,
      },

      text: String,
    },
  ],
  created: {
    date: { type: Date, default: new Date(Date.now()) },
    id: Number,
  },
});

const CRM = mongoose.model('crm', crmSchema);

export default CRM;
