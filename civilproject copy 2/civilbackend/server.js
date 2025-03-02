const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const beamRoutes = require('./routes/beamRoutes');
const columnRoutes = require('./routes/columnRoutes');

// Route imports
const structureRoutes = require('./routes/structureRoutes');
const budgetRoutes = require('./routes/budgetRoutes');
const earthworkRoutes = require('./routes/earthworkRoutes');
const boqRoutes = require('./routes/boqRoutes');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Configure Mongoose
mongoose.set('strictQuery', true); // Handle deprecation warning

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/civilproject', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/structures', structureRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/earthworks', earthworkRoutes);
app.use('/api/boq', boqRoutes);
app.use('/api/beam', beamRoutes);
app.use('/api/column', columnRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        error: err.message || 'Internal Server Error'
    });
});

// Get available port
const PORT = process.env.PORT || 8080;

// Improved server start with error handling
const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use. Please try a different port or kill the process using this port.`);
        process.exit(1);
    } else {
        console.error('Server error:', err);
    }
});
