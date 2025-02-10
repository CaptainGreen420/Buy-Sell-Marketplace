import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    transactionStatus: {
        type: String,
        enum: ['Pending', 'Completed'],
        default: 'Pending'
    },
    buyerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    sellerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    Item: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item'
    },
    hashedOtp: {
        type: String,
        required: true
    }
}, {
    minimize: false,
    timestamps: true
});

const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);

export default Order;
