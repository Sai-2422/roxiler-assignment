// transaction.schema.js
import mongoose from 'mongoose';

const transactionSchema = mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    sold: {
        type: Boolean,
        required: true,
    },
    dateOfSale: {
        type: Date,
        required: true
    }
});

const transactionModel = mongoose.model('Transaction', transactionSchema);

export default transactionModel;
