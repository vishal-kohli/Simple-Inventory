const express = require('express');
const app = express();
const port = 3002;
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors');

app.use(cors())
app.use(bodyParser.json());

const pool = mysql.createPool({
    connectionLimit: 10,
    user: 'root',
    password: 'password',
    host: 'mysql_db',
    // host: 'localhost',
    port: '3306',
    database: 'inventory_db'
});

pool.on('connection', function (connection) {
    connection.query('CREATE TABLE IF NOT EXISTS products (name varchar(30) PRIMARY KEY, quantity SMALLINT)', function (err, res) {
        if (err) {
            console.log(err);
        }
    })
});

//Method will get all existing products;---------------------
app.get('/getInventory', (req, res) => {
    let response = {
        "data": false,
        "error": null
    };


    pool.query('SELECT name, quantity FROM products', function (err, result) {
        if (err) {
            console.log(err);
            response.error = err;
            res.send(response);
        }
        else {
            response.data = result;
            res.send(response);
        }
    })
});


app.listen(port, () => {
    console.log(`Inventory is listening at http://localhost:${port}`);
});