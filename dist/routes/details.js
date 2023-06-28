"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const database_1 = __importDefault(require("../config/database"));
const route = (0, express_1.Router)();
const nameRegex = /^[a-zA-Z\s]+$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^\d{10}$/;
route.get('/students', (req, res) => {
    database_1.default.query('select * from students', (error, results) => {
        if (error) {
            console.log('Error retrieving data', error);
            res.status(500).send('Internal server error');
        }
        else {
            res.json(results);
        }
    });
});
route.post('/students', (req, res) => {
    const { name, email, phoneNo, address } = req.body;
    if (!nameRegex.test(name)) {
        res.status(400).json({ error: 'Invalid name format' });
        return;
    }
    if (!emailRegex.test(email)) {
        res.status(400).json({ error: 'Invalid email format' });
        return;
    }
    if (!phoneRegex.test(phoneNo)) {
        res.status(400).json({ error: 'Invalid phone number format' });
        return;
    }
    database_1.default.query('SELECT * FROM students WHERE email = ?', [email], (error, emailResults) => {
        if (error) {
            console.log('Error checking email:', error);
            res.status(500).send('Internal Server Error');
        }
        else if (emailResults.length > 0) {
            res.status(409).json({ error: 'Email already exists' });
            return;
        }
        else {
            database_1.default.query('SELECT * FROM students WHERE phoneNo = ?', [phoneNo], (error, phoneResults) => {
                if (error) {
                    console.log('Error checking phone number:', error);
                    res.status(500).send('Internal Server Error');
                }
                else if (phoneResults.length > 0) {
                    res.status(409).json({ error: 'Phone number already exists' });
                    return;
                }
                else {
                    database_1.default.query('INSERT INTO students (name, email, phoneNo, address) VALUES (?, ?, ?, ?)', [name, email, phoneNo, address], (error, insertResults) => {
                        if (error) {
                            console.log('Error creating student:', error);
                            res.status(500).send('Internal Server Error');
                        }
                        else {
                            res.json(insertResults);
                        }
                    });
                }
            });
        }
    });
});
route.put('/students/:id', (req, res) => {
    const { id } = req.params;
    const newData = req.body;
    if (newData.name && !nameRegex.test(newData.name)) {
        res.status(400).json({ error: 'Invalid name format' });
        return;
    }
    if (newData.email && !emailRegex.test(newData.email)) {
        res.status(400).json({ error: 'Invalid email format' });
        return;
    }
    if (newData.phoneNo && !phoneRegex.test(newData.phoneNo)) {
        res.status(400).json({ error: 'Invalid phone number format' });
        return;
    }
    if (newData.email) {
        database_1.default.query('SELECT * FROM students WHERE email = ? AND id != ?', [newData.email, id], (error, emailResults) => {
            if (error) {
                console.log('Error checking email:', error);
                res.status(500).send('Internal Server Error');
            }
            else if (emailResults.length > 0) {
                res.status(409).json({ error: 'Email already exists' });
                return;
            }
            else {
                if (newData.phoneNo) {
                    database_1.default.query('SELECT * FROM students WHERE phoneNo = ? AND id != ?', [newData.phoneNo, id], (error, phoneResults) => {
                        if (error) {
                            console.log('Error checking phone number:', error);
                            res.status(500).send('Internal Server Error');
                        }
                        else if (phoneResults.length > 0) {
                            res.status(409).json({ error: 'Phone number already exists' });
                            return;
                        }
                        else {
                            database_1.default.query('UPDATE students SET ? WHERE id = ?', [newData, id], (error, updateResults) => {
                                if (error) {
                                    console.log('Error updating student:', error);
                                    res.status(500).send('Internal Server Error');
                                }
                                else {
                                    res.json(updateResults);
                                }
                            });
                        }
                    });
                }
                else {
                    database_1.default.query('UPDATE students SET ? WHERE id = ?', [newData, id], (error, updateResults) => {
                        if (error) {
                            console.log('Error updating student:', error);
                            res.status(500).send('Internal Server Error');
                        }
                        else {
                            res.json(updateResults);
                        }
                    });
                }
            }
        });
    }
});
exports.default = route;
