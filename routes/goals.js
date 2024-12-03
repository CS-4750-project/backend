const express = require('express');
const router = express.Router();

// GET all goals
router.get('/', async (req, res) => {
    try {
        const result = await req.db.query('SELECT * FROM Goal');
        res.json(result.recordset);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// GET a specific goal by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await req.db.query(`SELECT * FROM Goal WHERE GoalID = ${id}`);
        res.json(result.recordset[0] || { message: 'Goal not found' });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// POST: Add a new goal
router.post('/', async (req, res) => {
    try {
        const { UserID, description, progress, deadline } = req.body;
        await req.db.query(`
            INSERT INTO Goal (UserID, [description], progress, deadline)
            VALUES (${UserID}, '${description}', ${progress || 0}, '${deadline}')
        `);
        res.status(201).send('Goal added successfully');
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// PUT: Update an existing goal
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { description, progress, deadline } = req.body;
        await req.db.query(`
            UPDATE Goal
            SET [description] = '${description}', progress = ${progress}, deadline = '${deadline}'
            WHERE GoalID = ${id}
        `);
        res.send('Goal updated successfully');
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// DELETE: Remove a goal
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await req.db.query(`DELETE FROM Goal WHERE GoalID = ${id}`);
        res.send('Goal deleted successfully');
    } catch (err) {
        res.status(500).send(err.message);
    }
});

module.exports = router;