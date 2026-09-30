const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const { sequelize, initDatabase } = require('./config/database');
const routes = require('./routes'); // routes/index.js

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'UP',
    timestamp: new Date().toISOString(),
    service: 'GST Invoice Engine'
  });
});

// Mount Routes: Server => Routes => Controller => Service => DB
app.use('/api', routes);

async function startServer() {
  try {
    await initDatabase();

    // Sync database models safely
    try {
      await sequelize.sync();
      console.log('✅ [Database] Models synchronized successfully.');
    } catch (syncError) {
      console.warn('⚠️ [Database] Model synchronization warning:', syncError.message);
    }

    app.listen(PORT, () => {
      console.log(`🚀 [Server] Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ [Server] Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
