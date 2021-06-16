import mongoose from 'mongoose';

const crmSchema = mongoose.Schema({
  oc: Number,
  datum: { type: String, default: new Date(Date.now()) },
  klient: {
    ico: String,
    firma: String,
    osoba: String,
    tel: String,
    email: String,
  },
  zaznamy: [
    {
      datum: Date,
      oc: Number,
      text: String,
    },
  ],
});

const CRM = mongoose.model('crm', crmSchema);

export default CRM;
