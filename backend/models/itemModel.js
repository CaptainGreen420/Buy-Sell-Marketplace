import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    sellerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['available', 'sold'],
        default: 'available'
    }
}, {
    timestamps: true
});

itemSchema.pre('find', function(next) {
    this.populate('sellerId', 'firstName lastName');
    next();
});

itemSchema.pre('findOne', function(next) {
    this.populate('sellerId', 'firstName lastName');
    next();
});

const Item = mongoose.models.Item || mongoose.model('Item', itemSchema);

export default Item;
