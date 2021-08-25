import mongoose from 'mongoose';

const orderSchema = mongoose.Schema({});

const Order = mongoose.model('Order', orderSchema);

export default Order;
