const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const { sequelize, initDatabase } = require('./config/database');
const routes = require('./routes'); // routes/index.js

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: '*' }));
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

    // Sync database models
    await sequelize.sync({ alter: true });
    console.log('✅ [Database] Models synchronized successfully.');

    app.listen(PORT, () => {
      console.log(`🚀 [Server] Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ [Server] Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
