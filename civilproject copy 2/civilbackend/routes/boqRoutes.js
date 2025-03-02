const express = require('express');
const router = express.Router();
const multer = require('multer');
const XLSX = require('xlsx');
const BOQ = require('../models/BOQ');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const unitConversions = {
    'cft': { to: 'm³', factor: 0.0283168 },
    'cum': { to: 'm³', factor: 1 },
    'm3': { to: 'm³', factor: 1 },
    'm³': { to: 'm³', factor: 1 },
    'bags': { to: 'kg', factor: 50 },
    'kg': { to: 'kg', factor: 1 },
    'nos': { to: 'pcs', factor: 1 },
    'pcs': { to: 'pcs', factor: 1 }
};

router.post('/upload', upload.single('boqFile'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        // Skip header row and process data
        const items = data.slice(1).map(row => {
            const quantity = parseFloat(row[0]) || 0;
            return {
                quantity: quantity,
                unit: {
                    original: '',
                    iso: ''
                }
            };
        });

        res.json({ items });
    } catch (error) {
        console.error('Error processing BOQ:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;