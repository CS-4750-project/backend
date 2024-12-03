const express = require('express');
const router = express.Router();

// GET all users
router.get('/', async (req, res) => {
    try {
        const result = await req.db.query('SELECT * FROM Users');
        res.json(result.recordset);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// GET a specific user by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await req.db.query(`SELECT * FROM Users WHERE UserID = ${id}`);
        res.json(result.recordset[0] || { message: 'User not found' });
    } catch (err) {
        res.status(500).send(err.message);
    }
});


// POST: Add a new user
router.post('/', async (req, res) => {
    try {
        const { DOB, Gender, password, email, NotifPrefs, mode, name, locationType } = req.body;
        const request = req.db.request();
        request.input('DOB', DOB);
        request.input('Gender', Gender);
        request.input('password', password);
        request.input('email', email);
        request.input('NotifPrefs', NotifPrefs);
        request.input('mode', mode);
        request.input('name', name);
        request.input('locationType', locationType);

        await request.query(`
            INSERT INTO Users (DOB, Gender, [password], email, NotifPrefs, mode, [name], locationType)
            VALUES (@DOB, @Gender, @password, @Email, @NotifPrefs, @Mode, @Name, @LocationType)
        `);

        res.status(201).send({ message: 'User added successfully' });
    } catch (err) {
        console.error('Error adding user:', err.message);
        res.status(500).send({ error: 'Failed to add user', details: err.message });
    }
});

// PUT: Update an existing user
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { DOB, Gender, password, email, NotifPrefs, mode, name, locationType } = req.body;
        await req.db.query(`
            UPDATE Users
            SET DOB = '${DOB}', Gender = '${Gender}', [password] = '${password}', email = '${email}', 
                NotifPrefs = '${NotifPrefs}', mode = '${mode}', [name] = '${name}', locationType = '${locationType}'
            WHERE UserID = ${id}
        `);
        res.send('User updated successfully');
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// DELETE: Remove a user
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await req.db.query(`DELETE FROM Users WHERE UserID = ${id}`);
        res.send('User deleted successfully');
    } catch (err) {
        res.status(500).send(err.message);
    }
});

module.exports = router;