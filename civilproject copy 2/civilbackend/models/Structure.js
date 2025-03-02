const mongoose = require('mongoose');

const BeamSchema = new mongoose.Schema({
    dimensions: {
        length: { type: Number, required: true },
        width: { type: Number, required: true },
        depth: { type: Number, required: true },
        unit: { type: String, default: 'mm' }
    },
    reinforcement: {
        mainBars: {
            diameter: { type: Number, required: true },
            count: { type: Number, required: true },
            totalLength: { type: Number },
            weight: { type: Number },
            unitWeight: { type: Number },
            unit: { type: String, default: 'mm' }
        },
        stirrups: {
            diameter: { type: Number, required: true },
            spacing: { type: Number, required: true },
            cover: { type: Number, required: true },
            count: { type: Number },
            perimeter: { type: Number },
            totalLength: { type: Number },
            weight: { type: Number },
            unit: { type: String, default: 'mm' }
        }
    },
    calculations: {
        concrete: {
            volume: { type: Number, required: true },
            unit: { type: String, default: 'm³' }
        },
        steel: {
            mainBars: {
                count: Number,
                diameter: Number,
                totalLength: Number,
                weight: Number,
                unitWeight: Number
            },
            stirrups: {
                count: Number,
                diameter: Number,
                spacing: Number,
                perimeter: Number,
                totalLength: Number,
                weight: Number
            },
            totalWeight: { type: Number, required: true },
            percentage: { type: Number, required: true },
            unit: { type: String, default: 'kg' }
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update the updatedAt field on save
BeamSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Beam', BeamSchema);
