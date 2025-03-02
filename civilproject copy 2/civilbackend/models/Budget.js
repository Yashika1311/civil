const mongoose = require('mongoose');

const BudgetSchema = new mongoose.Schema({
    projectName: {
        type: String,
        required: true
    },
    totalBudget: {
        amount: { type: Number, required: true },
        currency: { type: String, default: 'INR' }
    },
    monthlyAllocation: [{
        month: { type: Date, required: true },
        plannedAmount: { type: Number, required: true },
        actualAmount: { type: Number },
        variance: { type: Number },
        status: {
            type: String,
            enum: ['planned', 'in-progress', 'completed'],
            default: 'planned'
        }
    }],
    categories: [{
        name: { type: String, required: true },
        allocation: { type: Number, required: true },
        spent: { type: Number, default: 0 }
    }],
    lastUpdated: {
        type: Date,
        default: Date.now
    },
    nextUpdateReminder: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'archived'],
        default: 'active'
    }
});

module.exports = mongoose.model('Budget', BudgetSchema);
