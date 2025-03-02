const mongoose = require('mongoose');

const BOQSchema = new mongoose.Schema({
    projectName: {
        type: String,
        required: true
    },
    items: [{
        description: { type: String, required: true },
        quantity: { type: Number, required: true },
        unit: {
            original: { type: String, required: true },
            iso: { type: String, required: true }
        },
        rate: { type: Number, required: true },
        amount: { type: Number, required: true }
    }],
    totalAmount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['draft', 'verified', 'approved'],
        default: 'draft'
    },
    uploadDate: {
        type: Date,
        default: Date.now
    },
    lastModified: {
        type: Date,
        default: Date.now
    },
    verificationNotes: [{
        note: String,
        timestamp: { type: Date, default: Date.now }
    }]
});

module.exports = mongoose.model('BOQ', BOQSchema);
