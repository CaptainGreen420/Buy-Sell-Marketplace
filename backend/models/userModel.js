import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Only valid email addresses are allowed!']
    },
    age: {
        type: Number,
        min: 1,
        max: 150
    },
    contactNumber: {
        type: String,
        required: true,
        match: [/^\d{10}$/, 'Contact number must be 10 digits']
    },
    password: {
        type: String,
        required: true,
        minlength: 4
    },
    cartItems: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item',
        default: []
    }],
    sellerReviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review',
        default: []
    }]
}, {
    minimize: false,
    timestamps: true
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;
