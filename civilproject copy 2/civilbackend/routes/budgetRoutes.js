const express = require('express');
const router = express.Router();
const Budget = require('../models/Budget');
const nodeSchedule = require('node-schedule');

// Create new budget
router.post('/', async (req, res) => {
    try {
        const { projectName, totalBudget, categories } = req.body;

        // Set next update reminder to 1 month from now
        const nextUpdateReminder = new Date();
        nextUpdateReminder.setMonth(nextUpdateReminder.getMonth() + 1);

        const budget = new Budget({
            projectName,
            totalBudget,
            categories,
            nextUpdateReminder
        });

        await budget.save();

        // Schedule monthly reminder
        nodeSchedule.scheduleJob(nextUpdateReminder, async () => {
            // Update next reminder date
            const newReminder = new Date();
            newReminder.setMonth(newReminder.getMonth() + 1);
            
            await Budget.findByIdAndUpdate(budget._id, {
                nextUpdateReminder: newReminder
            });
            
            // Here you would typically send an email notification
            console.log(`Budget update reminder for project: ${projectName}`);
        });

        res.json(budget);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all budgets
router.get('/', async (req, res) => {
    try {
        const budgets = await Budget.find();
        res.json(budgets);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update budget
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        
        const budget = await Budget.findByIdAndUpdate(id, updates, { new: true });
        if (!budget) {
            return res.status(404).json({ error: 'Budget not found' });
        }
        
        res.json(budget);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get budget by ID
router.get('/:id', async (req, res) => {
    try {
        const budget = await Budget.findById(req.params.id);
        if (!budget) {
            return res.status(404).json({ error: 'Budget not found' });
        }
        res.json(budget);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
