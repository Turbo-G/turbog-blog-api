const express = require('express');
const mysql = require('mysql');
const http = require('http');

//create http server using express
const app = express();
const server = http.createServer(app);

server.listen(3000, () => {
    console.log('Server is running on port 3000');
});


var db = mysql.createPool({
    connectionLimit: 10,
    host: '167.235.115.90',
    user: 'turbog_blog',
    password: 'zuccazucchina',
    database: 'turbog_blog',
    connectTimeout: 10000,
    multipleStatements: true,
    debug: false
});

db.getConnection((err, connection) => {
    if (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.log('Database connection was closed.');
        }
        if (err.code === 'ER_CON_COUNT_ERROR') {
            console.log('Database has too many connections.');
        }
        if (err.code === 'ECONNREFUSED') {
            console.log('Database connection was refused.');
        }
    }
    else 
    {
        console.log('Database connection established.');
    }
});

app.get('/api', (req, res) => {
    res.send('Hello World!');
});

app.get('/api/blog', (req, res) => {
    db.query('SELECT * FROM articles', (err, results) => {
        if (err) {
            log('error', err);
        }
        else {
            res.send(results);
        }
    });
});

app.get('/api/blog/:id', (req, res) => {
    db.query('SELECT * FROM articles WHERE id = ?', [req.params.id], (err, results) => {
        if (err) {
            log('error', err);
        }
        else {
            if (results.length > 0) {
                res.send(results);
            } else {
                res.json({
                    message: 'No results found'
                });
            }
        }
    });
});