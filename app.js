require('dotenv').config(); // Load environment variables
const express = require('express');
const bodyParser = require('body-parser');
const mssql = require('mssql');
const app = express();

// Middleware for parsing JSON
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
            console.log('Connecting to the database...');
            global.connectionPool = await mssql.connect(dbConfig);
            console.log('Database connected successfully');
        }
        req.db = global.connectionPool; // Attach the connection pool to the request object
        next();
    } catch (err) {
        console.error('Database connection failed:', err.message);
        res.status(500).send({ error: 'Database connection error', details: err.message });
    }
});

// Importing Routes
const usersRoutes = require('./routes/users');
const feedbackRoutes = require('./routes/feedback');
const reportsRoutes = require('./routes/reports');
const goalsRoutes = require('./routes/goals');
const transportationRoutes = require('./routes/transportation');

// Register Routes
app.use('/api/users', usersRoutes); // Users routes
app.use('/api/feedback', feedbackRoutes); // Feedback routes
app.use('/api/reports', reportsRoutes); // Reports routes
app.use('/api/goals', goalsRoutes); // Goals routes
app.use('/api/transportation', transportationRoutes); // Transportation routes

// Default Route
app.get('/', (req, res) => {
    res.send('Welcome to the Personal Carbon Footprint Tracker API!');
});

// Error Handling Middleware for Unknown Routes
app.use((req, res, next) => {
    res.status(404).send({ error: 'Route not found' });
});

// General Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ error: 'Something went wrong!' });
});

// Start the Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});