const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to DB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get('/', (req, res) => {
  res.send('Accessories API is running 🎧');
});
// Auth Route
app.use('/api/auth', require('./routes/authRoutes'));
// Product Route
app.use('/api/products', require('./routes/productRoutes'));
// Order Route
app.use('/api/orders', require('./routes/orderRoutes'));



// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
