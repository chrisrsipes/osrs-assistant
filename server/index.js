const express = require('express');
const cors = require('cors');
const seedRoutes = require('./routes/seeds');
const farmPatchRoutes = require('./routes/farmPatches');
const farmRunRoutes = require('./routes/farmRuns');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/seeds', seedRoutes);
app.use('/api/farm-patches', farmPatchRoutes);
app.use('/api/farm-runs', farmRunRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'OSRS Skilling Assistant API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 API endpoints available at http://localhost:${PORT}/api/`);
});
