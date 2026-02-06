const sql = require('mssql');
require('dotenv').config();

const server = process.env.DB_SERVER || 'localhost';
const [host, instanceName] = server.split('\\');

const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: host,
    database: process.env.DB_NAME,
    options: {
        encrypt: false, // Use true for Azure, false for local dev usually
        trustServerCertificate: true, // Initial dev environment common setting
        instanceName: instanceName, // Handle named instance if present
        enableArithAbort: true
    },
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    },
    connectionTimeout: 30000 // Increase timeout
};

const connectDB = async () => {
    try {
        await sql.connect(dbConfig);
        console.log('Connected to SQL Server');
    } catch (err) {
        console.error('Database connection failed:', err);
        throw err;
    }
};

const getDB = () => sql;

module.exports = { connectDB, getDB, sql };
