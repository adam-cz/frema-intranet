import mongoose from 'mongoose';

const orderSchema = mongoose.Schema({
  opv: { type: String, unique: true },
  operace: [
    {
      cislo: Number,
      timeStamps: [Date],
    },
  ],
});

const Order = mongoose.model('Order', orderSchema);

export default Order;
