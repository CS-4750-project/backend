const express = require('express');
const router = express.Router();

// GET all feedback
router.get('/', async (req, res) => {
    try {
        const result = await req.db.query('SELECT * FROM Feedback');
        res.json(result.recordset);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// GET specific feedback by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await req.db.query(`SELECT * FROM Feedback WHERE FeedbackID = ${id}`);
        res.json(result.recordset[0] || { message: 'Feedback not found' });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// POST: Add new feedback
router.post('/', async (req, res) => {
    try {
        const { UserID, comment } = req.body;
        await req.db.query(`
            INSERT INTO Feedback (UserID, comment)
            VALUES (${UserID}, '${comment}')
        `);
        res.status(201).send('Feedback added successfully');
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// PUT: Update feedback
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { comment } = req.body;
        await req.db.query(`
            UPDATE Feedback
            SET comment = '${comment}'
            WHERE FeedbackID = ${id}
        `);
        res.send('Feedback updated successfully');
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// DELETE: Remove feedback
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await req.db.query(`DELETE FROM Feedback WHERE FeedbackID = ${id}`);
        res.send('Feedback deleted successfully');
    } catch (err) {
        res.status(500).send(err.message);
    }
});

module.exports = router;