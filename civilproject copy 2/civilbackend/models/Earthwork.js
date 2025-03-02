const mongoose = require('mongoose');

const EarthworkSchema = new mongoose.Schema({
    projectSection: {
        type: String,
        required: true
    },
    dimensions: {
        length: { type: Number, required: true },
        width: { type: Number, required: true },
        depth: { type: Number, required: true },
        unit: { type: String, default: 'm' }
    },
    calculations: {
        volume: { type: Number, required: true },
        volumeUnit: { type: String, default: 'm3' },
        bulkingFactor: { type: Number, default: 1.2 },
        finalVolume: Number
    },
    soil: {
        type: { type: String, required: true },
        density: { type: Number },
        moistureContent: { type: Number }
    },
    cost: {
        ratePerUnit: { type: Number },
        totalCost: { type: Number },
        currency: { type: String, default: 'INR' }
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Earthwork', EarthworkSchema);
