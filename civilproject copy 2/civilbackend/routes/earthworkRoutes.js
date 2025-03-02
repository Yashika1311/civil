const express = require('express');
const router = express.Router();
const Earthwork = require('../models/Earthwork');

// Calculate and create earthwork record
router.post('/calculate', async (req, res) => {
    try {
        const { projectSection, dimensions, soil, cost } = req.body;

        // Calculate volume
        const { length, width, depth, unit } = dimensions;
        let volume = length * width * depth;

        // Convert to cubic meters if necessary
        if (unit === 'cm') {
            volume /= 1000000;
        } else if (unit === 'mm') {
            volume /= 1000000000;
        }

        // Apply bulking factor
        const bulkingFactor = soil.type === 'loose' ? 1.25 : 
                            soil.type === 'medium' ? 1.2 : 1.15;
        
        const finalVolume = volume * bulkingFactor;

        // Calculate total cost
        const totalCost = cost.ratePerUnit * finalVolume;

        const earthwork = new Earthwork({
            projectSection,
            dimensions,
            soil,
            cost: {
                ...cost,
                totalCost
            },
            calculations: {
                volume,
                volumeUnit: 'm3',
                bulkingFactor,
                finalVolume
            }
        });

        await earthwork.save();
        res.json(earthwork);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all earthwork calculations
router.get('/', async (req, res) => {
    try {
        const earthworks = await Earthwork.find();
        res.json(earthworks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get specific earthwork calculation
router.get('/:id', async (req, res) => {
    try {
        const earthwork = await Earthwork.findById(req.params.id);
        if (!earthwork) {
            return res.status(404).json({ error: 'Earthwork calculation not found' });
        }
        res.json(earthwork);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
