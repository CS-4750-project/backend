const express = require('express');
const router = express.Router();

// GET all reports
router.get('/', async (req, res) => {
    try {
        const result = await req.db.query('SELECT * FROM Reports');
        res.json(result.recordset);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// GET a specific report by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await req.db.query(`SELECT * FROM Reports WHERE ReportID = ${id}`);
        res.json(result.recordset[0] || { message: 'Report not found' });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// POST: Add a new report
router.post('/', async (req, res) => {
    try {
        const { UserID, reportDate, totalFootprint, summary } = req.body;
        await req.db.query(`
            INSERT INTO Reports (UserID, reportDate, totalFootprint, summary)
            VALUES (${UserID}, '${reportDate}', ${totalFootprint}, '${summary}')
        `);
        res.status(201).send('Report added successfully');
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// PUT: Update an existing report
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { reportDate, totalFootprint, summary } = req.body;
        await req.db.query(`
            UPDATE Reports
            SET reportDate = '${reportDate}', totalFootprint = ${totalFootprint}, summary = '${summary}'
            WHERE ReportID = ${id}
        `);
        res.send('Report updated successfully');
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// DELETE: Remove a report
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await req.db.query(`DELETE FROM Reports WHERE ReportID = ${id}`);
        res.send('Report deleted successfully');
    } catch (err) {
        res.status(500).send(err.message);
    }
});

module.exports = router;