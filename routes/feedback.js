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
        const result = await req.db.query(`SELECT * FROM Feedback WHERE FeedbackID = @id`, {
            id,
        });
        res.json(result.recordset[0] || { message: 'Feedback not found' });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// POST: Add new feedback
router.post('/', async (req, res) => {
    try {
        const { UserID, comment } = req.body;

        // Validate input
        if (!UserID || !comment) {
            return res.status(400).json({ error: 'Missing required fields: UserID and comment' });
        }

        const query = `
            INSERT INTO Feedback (UserID, comment)
            VALUES (@UserID, @comment)
        `;
        await req.db.request()
            .input('UserID', req.db.Int, UserID)
            .input('comment', req.db.NVarChar, comment)
            .query(query);
        res.status(201).send('Feedback added successfully');
    } catch (err) {
        res.status(500).send({ error: 'Failed to add feedback', details: err.message });
    }
});

// POST: Add new feedback
router.post('/', async (req, res) => {
    try {
        const { UserID, comment, dateSubmitted } = req.body;

        // Validate required fields
        if (!UserID || !comment) {
            return res.status(400).send({ error: 'Missing required fields: UserID and comment are required.' });
        }

        // Prepare the query
        const query = `
            INSERT INTO Feedback (UserID, comment, dateSubmitted)
            VALUES (@UserID, @comment, @dateSubmitted)
        `;

        // Execute the query
        const request = req.db.request();
        request.input('UserID', req.db.Int, UserID);
        request.input('comment', req.db.NVarChar, comment);
        if (dateSubmitted) {
            request.input('dateSubmitted', req.db.Date, dateSubmitted);
        } else {
            request.input('dateSubmitted', req.db.Date, null);
        }
        await request.query(query);

        res.status(201).send({ message: 'Feedback added successfully' });
    } catch (err) {
        res.status(500).send({ error: 'Failed to add feedback', details: err.message });
    }
});

// DELETE: Remove feedback
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const query = `DELETE FROM Feedback WHERE FeedbackID = @id`;
        await req.db.request()
            .input('id', req.db.Int, id)
            .query(query);
        res.send('Feedback deleted successfully');
    } catch (err) {
        res.status(500).send({ error: 'Failed to delete feedback', details: err.message });
    }
});

module.exports = router;