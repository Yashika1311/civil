const express = require('express');
const router = express.Router();

// Store calculation history (in-memory for now, consider using a database in production)
let calculationHistory = [];

router.post('/calculate', (req, res) => {
    try {
        const { dimensions, reinforcement } = req.body;
        
        // Extract dimensions
        const length = parseFloat(dimensions.length);
        const breadth = parseFloat(dimensions.breadth);
        const height = parseFloat(dimensions.height);
        
        // Extract reinforcement details
        const mainBars = reinforcement.mainBars;
        const stirrups = reinforcement.stirrups;
        
        // Calculate concrete volume
        const concreteVolume = (length * breadth * height) / 1000000000; // Convert mm³ to m³
        
        // Calculate main bars
        const mainBarLength = height; // in mm
        const mainBarCount = parseInt(mainBars.count);
        const mainBarDiameter = parseFloat(mainBars.diameter);
        const mainBarWeight = (Math.pow(mainBarDiameter, 2) * mainBarLength * mainBarCount) / (162 * 1000); // in kg
        
        // Calculate stirrups
        const stirrupSpacing = parseFloat(stirrups.spacing);
        const stirrupCount = Math.floor(height / stirrupSpacing) + 1;
        const stirrupDiameter = parseFloat(stirrups.diameter);
        
        // Calculate stirrup perimeter (assuming rectangular stirrup)
        const cover = parseFloat(stirrups.cover);
        const stirrupLength = 2 * ((length - 2 * cover) + (breadth - 2 * cover)); // Perimeter of stirrup
        const stirrupTotalLength = stirrupLength * stirrupCount;
        const stirrupWeight = (Math.pow(stirrupDiameter, 2) * stirrupTotalLength) / (162 * 1000); // in kg
        
        // Total steel weight
        const totalSteelWeight = mainBarWeight + stirrupWeight;
        
        const results = {
            concrete: {
                volume: concreteVolume,
                unit: 'm³'
            },
            steel: {
                mainBars: {
                    totalLength: mainBarLength / 1000, // Convert to meters
                    weight: mainBarWeight
                },
                stirrups: {
                    count: stirrupCount,
                    totalLength: stirrupTotalLength / 1000, // Convert to meters
                    weight: stirrupWeight
                },
                totalWeight: totalSteelWeight
            }
        };
        
        // Save calculation to history
        calculationHistory.push({
            date: new Date(),
            dimensions: {
                length,
                breadth,
                height
            },
            results
        });
        
        // Keep only the last 10 calculations
        if (calculationHistory.length > 10) {
            calculationHistory = calculationHistory.slice(-10);
        }
        
        res.json({ result: results });
    } catch (error) {
        console.error('Error in column calculation:', error);
        res.status(400).json({ error: 'Invalid input data' });
    }
});

router.get('/history', (req, res) => {
    res.json(calculationHistory);
});

module.exports = router;
