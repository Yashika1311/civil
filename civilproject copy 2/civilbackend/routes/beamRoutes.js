const express = require('express');
const router = express.Router();
const Beam = require('../models/Structure'); // Using the Structure model for beams
const { calculateBeam } = require('../utils/beamCalculations');

// Calculate beam
router.post('/calculate', async (req, res) => {
    try {
        const { dimensions, reinforcement } = req.body;
        
        // Basic validation
        if (!dimensions || !reinforcement) {
            return res.status(400).json({ 
                error: 'Missing required parameters',
                required: {
                    dimensions: {
                        length: 'mm',
                        width: 'mm',
                        depth: 'mm'
                    },
                    reinforcement: {
                        mainBars: {
                            diameter: 'mm',
                            count: 'number'
                        },
                        stirrups: {
                            diameter: 'mm',
                            spacing: 'mm',
                            cover: 'mm'
                        }
                    }
                }
            });
        }

        // Validate numeric values
        const validateNumeric = (obj) => {
            for (let key in obj) {
                if (typeof obj[key] === 'object') {
                    validateNumeric(obj[key]);
                } else if (key !== 'unit' && (isNaN(obj[key]) || obj[key] <= 0)) {
                    throw new Error(`Invalid value for ${key}. Must be a positive number.`);
                }
            }
        };

        validateNumeric(dimensions);
        validateNumeric(reinforcement);

        // Perform beam calculations
        const calculations = calculateBeam(dimensions, reinforcement);

        // Create new beam record
        const beam = new Beam({
            type: 'beam',
            dimensions,
            reinforcement,
            calculations
        });

        await beam.save();
        res.json({
            message: 'Beam calculation completed successfully',
            result: calculations,
            beamId: beam._id
        });
    } catch (error) {
        console.error('Beam calculation error:', error);
        res.status(500).json({ 
            error: error.message || 'Error performing beam calculation',
            details: error.stack
        });
    }
});

// Get calculation history
router.get('/history', async (req, res) => {
    try {
        const beams = await Beam.find({ type: 'beam' })
            .sort({ createdAt: -1 })
            .limit(10);
        res.json(beams);
    } catch (error) {
        console.error('History fetch error:', error);
        res.status(500).json({ 
            error: 'Error fetching beam calculation history',
            details: error.message
        });
    }
});

// Get specific beam calculation by ID
router.get('/calculation/:id', async (req, res) => {
    try {
        const beam = await Beam.findOne({ _id: req.params.id, type: 'beam' });
        if (!beam) {
            return res.status(404).json({ error: 'Beam calculation not found' });
        }
        res.json(beam);
    } catch (error) {
        console.error('Beam fetch error:', error);
        res.status(500).json({ 
            error: 'Error fetching beam calculation',
            details: error.message
        });
    }
});

module.exports = router;
