const express = require('express');
const router = express.Router();

// GET all transportation records
router.get('/', async (req, res) => {
    try {
        const result = await req.db.query('SELECT * FROM Transportation');
        res.json(result.recordset);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// GET a specific transportation record by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await req.db.query(`SELECT * FROM Transportation WHERE TransportationID = ${id}`);
        res.json(result.recordset[0] || { message: 'Transportation record not found' });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// POST: Add a new transportation record
router.post('/', async (req, res) => {
    try {
        const { UserID, distanceTraveled, fuelType, fuelEfficiency, type } = req.body;
        await req.db.query(`
            INSERT INTO Transportation (UserID, distanceTraveled, fuelType, fuelEfficiency, [type])
            VALUES (${UserID}, ${distanceTraveled}, '${fuelType}', ${fuelEfficiency}, '${type}')
        `);
        res.status(201).send('Transportation record added successfully');
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// PUT: Update an existing transportation record
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { distanceTraveled, fuelType, fuelEfficiency, type } = req.body;
        await req.db.query(`
            UPDATE Transportation
            SET distanceTraveled = ${distanceTraveled}, fuelType = '${fuelType}', 
                fuelEfficiency = ${fuelEfficiency}, [type] = '${type}'
            WHERE TransportationID = ${id}
        `);
        res.send('Transportation record updated successfully');
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// DELETE: Remove a transportation record
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await req.db.query(`DELETE FROM Transportation WHERE TransportationID = ${id}`);
        res.send('Transportation record deleted successfully');
    } catch (err) {
        res.status(500).send(err.message);
    }
});

module.exports = router;