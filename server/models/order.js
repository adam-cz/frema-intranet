import mongoose from 'mongoose';

const orderSchema = mongoose.Schema({
  id: { type: String, unique: true },
  desc: String,
  createdAt: Date,
  done: Boolean,
  doneAt: Date,
  canceled: Boolean,
  partner: String,
  createdBy: String,
});

const Order = mongoose.model('Order', orderSchema);

export default Order;
