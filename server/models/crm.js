import mongoose from 'mongoose';

const crmSchema = mongoose.Schema({
  client: {
    ico: Number,
    person_id: String,
  },
  records: [
    {
      created: {
        date: { type: Date, default: new Date(Date.now()) },
        id: Number,
      },
      coms: {
        phone: Boolean,
        email: Boolean,
        visit: Boolean,
        order: Boolean,
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
