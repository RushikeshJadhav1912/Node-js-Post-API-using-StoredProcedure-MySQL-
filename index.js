const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const app = express();
const port = 3000;

app.use(bodyParser.json());

// MySQL connection configuration
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root', // Replace with your MySQL root password
    database: 'customer_db'
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err.stack);
        return;
    }
    console.log('MySQL connected...');
});

app.post('/addCustomer', (req, res) => {
    const { firstName, lastName, email, mobileNumber, address, pincode } = req.body;

    // Input validation
    if (!firstName || !lastName || !email || !mobileNumber || !address || !pincode) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const mobileRegex = /^\+\d{1,3}\d{10}$/;
    const pincodeRegex = /^\d{5,6}$/;

    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
    }
    if (!mobileRegex.test(mobileNumber)) {
        return res.status(400).json({ error: 'Invalid mobile number format' });
    }
    if (!pincodeRegex.test(pincode)) {
        return res.status(400).json({ error: 'Invalid pincode format' });
    }

    // Stored procedure call
    const query = 'CALL InsertCustomerDetails(?, ?, ?, ?, ?, ?)';
    db.query(query, [firstName, lastName, email, mobileNumber, address, pincode], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Database insertion failed' });
        }
        res.status(200).json({ success: 'Customer details added successfully' });
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
