require('dotenv').config(); // Load environment variables
const express = require('express');
const bodyParser = require('body-parser');
const mssql = require('mssql');
const app = express();

// Middleware
app.use(bodyParser.json());

// Database Configuration
const dbConfig = {
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT, 10),
    options: {
        encrypt: true, // Use encryption for Azure SQL
        trustServerCertificate: true, // Required for self-signed certificates
    },
};

// Middleware to handle database connection
app.use(async (req, res, next) => {
    try {
        if (!global.connectionPool) {
            global.connectionPool = await mssql.connect(dbConfig);
            console.log('Connected to the database');
        }
        req.db = global.connectionPool;
        next();
    } catch (err) {
        console.error('Database connection failed:', err.message);
        res.status(500).send('Database connection error');
    }
});

// Routes
app.use('/api/users', require('./routes/users'));
app.use('/api/reports', require('./routes/reports'));
app.use('/api/feedback', require('./routes/feedback'));
app.use('/api/goals', require('./routes/goals'));
app.use('/api/transportation', require('./routes/transportation'));

// Default Route
app.get('/', (req, res) => {
    res.send('Welcome to the Personal Carbon Footprint Tracker API!');
});

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

// Start the Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});