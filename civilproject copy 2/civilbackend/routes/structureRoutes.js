const express = require('express');
const router = express.Router();
const Structure = require('../models/Structure');
const { 
    calculateBeam, 
    calculateColumn, 
    calculateFooting, 
    calculateSlab 
} = require('../utils/structuralCalculations');

// Calculate structural elements
router.post('/calculate', async (req, res) => {
    try {
        const { type, dimensions, reinforcement } = req.body;
        
        // Basic validation
        if (!type || !dimensions || !reinforcement) {
            return res.status(400).json({ 
                error: 'Missing required parameters',
                required: {
                    type: 'beam/column/footing/slab',
                    dimensions: 'object containing dimensional parameters',
                    reinforcement: 'object containing reinforcement details'
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

        // Perform calculations based on structure type
        let calculations;
        switch (type.toLowerCase()) {
            case 'beam':
                calculations = calculateBeam(dimensions, reinforcement);
                break;
            case 'column':
                calculations = calculateColumn(dimensions, reinforcement);
                break;
            case 'footing':
                calculations = calculateFooting(dimensions, reinforcement);
                break;
            case 'slab':
                calculations = calculateSlab(dimensions, reinforcement);
                break;
            default:
                return res.status(400).json({ 
                    error: 'Invalid structure type',
                    validTypes: ['beam', 'column', 'footing', 'slab']
                });
        }

        // Create new structure record
        const structure = new Structure({
            type,
            dimensions,
            reinforcement,
            calculations
        });

        await structure.save();
        res.json({
            message: 'Calculation completed successfully',
            result: calculations,
            structureId: structure._id
        });
    } catch (error) {
        console.error('Calculation error:', error);
        res.status(500).json({ 
            error: error.message || 'Error performing calculation',
            details: error.stack
        });
    }
});

// Get calculation history
router.get('/history', async (req, res) => {
    try {
        const structures = await Structure.find()
            .sort({ createdAt: -1 })
            .limit(10); // Limit to last 10 calculations
        res.json(structures);
    } catch (error) {
        console.error('History fetch error:', error);
        res.status(500).json({ 
            error: 'Error fetching calculation history',
            details: error.message
        });
    }
});

// Get specific calculation by ID
router.get('/calculation/:id', async (req, res) => {
    try {
        const structure = await Structure.findById(req.params.id);
        if (!structure) {
            return res.status(404).json({ error: 'Calculation not found' });
        }
        res.json(structure);
    } catch (error) {
        console.error('Calculation fetch error:', error);
        res.status(500).json({ 
            error: 'Error fetching calculation',
            details: error.message
        });
    }
});

module.exports = router;
