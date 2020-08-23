const express = require('express');
const app = express();
const port = 3001;
const bodyParser = require('body-parser');
const redis = require('redis')
const redis_client = redis.createClient()
const mysql = require('mysql');

app.use(bodyParser.json());

const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    database: 'mysql_db'
});

pool.on('connection', function (connection) {
    connection.query('CREATE TABLE IF NOT EXISTS products (name TEXT, quantity SMALLINT)', function (err, res) {
        if (err) {
            console.log(err);
        }
    })
});

// Method will delete list of incoming product names;-----------------
app.post('/delete', (req, res) => {
    const toBeDeleted = req.body.productNames;

    for (i = 0; i < toBeDeleted.length; i++) {
        redis_client.EXISTS(toBeDeleted[i], function (err, res) {
            console.log(res);

            // if exists - delete from redis and mysql
            if (res > 0) {
                redis_client.DEL(toBeDeleted[i], function (err, res) {
                    pool.query(`DELETE FROM products WHERE name ="${toBeDeleted[i]}"`, function (err, res) {
                        if (err) {
                            console.log(err);
                            res.send({ "operation_successful": false });
                        }
                        else {
                            res.send({ "operation_successful": true });
                        }
                    });
                });
            }
        })
    }

});

//Method will add list of incoming products;---------------------
app.post('/add', (req, res) => {
    const productName = req.body.productName;
    const productQuantity = req.body.productQuantity;

    //insert into redis
    redis_client.set(productName, productQuantity, function (err, reply) {
        if (err) {
            console.log(err);
            res.send({ "operation_successful": false });
        }

        // insert into mysql
        else {
            pool.query('INSERT INTO products SET ?', data, function (err, result) {
                if (err) {
                    console.log(err);
                    res.send({ "operation_successful": false });
                }
                else {
                    console.log(result);
                    res.send({ "operation_successful": true });
                }
            })
        }
    });
});

app.listen(port, () => {
    console.log(`Inventory is not listening at http://localhost:${port}`);
});