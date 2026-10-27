const { Sequelize } = require('sequelize');
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const dbHost = process.env.DB_HOST || 'localhost';
const dbPort = process.env.DB_PORT || 3306;
const dbUser = process.env.DB_USER || 'root';
const dbPassword = process.env.DB_PASSWORD || '';
const dbName = process.env.DB_NAME || 'invoice_db';
const requestedDialect = (process.env.DB_DIALECT || 'mysql').toLowerCase();
const autoFallback = process.env.AUTO_FALLBACK_SQLITE === 'true';

let useSqlite = requestedDialect === 'sqlite';

if (!useSqlite && autoFallback) {
  const { execFileSync } = require('child_process');
  try {
    execFileSync(process.execPath, ['-e', `
      const mysql = require('mysql2/promise');
      (async () => {
        try {
          const conn = await mysql.createConnection({
            host: ${JSON.stringify(dbHost)},
            port: ${JSON.stringify(dbPort)},
            user: ${JSON.stringify(dbUser)},
            password: ${JSON.stringify(dbPassword)},
            connectTimeout: 1500
          });
          await conn.end();
          process.exit(0);
        } catch (e) {
          process.exit(1);
        }
      })();
    `], { timeout: 3000, stdio: 'ignore' });
  } catch (e) {
    useSqlite = true;
    console.warn('⚠️ [Database] MySQL connection failed. Falling back to SQLite as AUTO_FALLBACK_SQLITE=true.');
  }
}

const sequelize = useSqlite
  ? new Sequelize({
      dialect: 'sqlite',
      storage: path.join(__dirname, '../../database.sqlite'),
      logging: false
    })
  : new Sequelize(dbName, dbUser, dbPassword, {
      host: dbHost,
      port: dbPort,
      dialect: 'mysql',
      logging: false,
      pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000
      }
    });

async function initDatabase() {
  if (useSqlite) {
    await sequelize.authenticate();
    console.log('✅ [Database] Successfully connected to SQLite database: database.sqlite');
    return sequelize;
  }

  try {
    // Try to connect to MySQL server and ensure DB exists
    const connection = await mysql.createConnection({
      host: dbHost,
      port: dbPort,
      user: dbUser,
      password: dbPassword,
      connectTimeout: 4000
    });

    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
    await connection.end();

    await sequelize.authenticate();
    console.log(`✅ [Database] Successfully connected to MySQL database: ${dbName}`);
    return sequelize;
  } catch (error) {
    console.error(`❌ [Database] Connection error:`, error.message);
    throw error;
  }
}

module.exports = {
  sequelize,
  initDatabase
};

