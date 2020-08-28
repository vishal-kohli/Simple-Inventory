const express = require('express');
const app = express();
const port = 3001;
const bodyParser = require('body-parser');
const redis = require('redis')
const redis_client = redis.createClient(
    // {host: 'redis_db'}
)
const mysql = require('mysql');
const cors = require('cors');

app.use(cors())
app.use(bodyParser.json());

const pool = mysql.createPool({
    connectionLimit: 10,
    user: 'root',
    password: 'password',
    // host: 'mysql_db',
    host: 'localhost',
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

// Method will delete list of incoming product names;-----------------
app.post('/api/delete', (req, res) => {
    const toBeDeleted = req.body;

    let response = {
        "operation_successful": false,
        "error": null
    };

    for (let i = 0; i < toBeDeleted.length; i++) {

        redis_client.EXISTS(toBeDeleted[i].NAME, function (err, result) {

            // if exists - delete from redis and mysql
            if (result > 0) {
                redis_client.del(toBeDeleted[i].NAME, function (err, result) {
                    if (err) {
                        console.log(err)
                        response.error = err;
                        res.send(response);
                    }
                    else {
                        console.log("here" + toBeDeleted[i].NAME);
                        pool.query(`DELETE FROM products WHERE name ="${toBeDeleted[i].NAME}"`, function (err, result) {
                            if (err) {
                                console.log(err)
                                response.error = err;
                                res.send(response);
                            }
                            else {
                                console.log(result);
                                response.operation_successful = true;
                                res.send(response);
                            }
                        });
                    }
                });
            }
            else {
                res.send(null);
            }
        })
    }


});

//Method will add list of incoming products;---------------------
app.post('/api/add', (req, res) => {
    const productName = req.body.itemName;
    const productQuantity = req.body.itemQuantity;
    console.log(req.body);
    let response = {
        "operation_successful": false,
        "error": null
    };

    //insert into redis
    redis_client.set(productName, productQuantity, function (err, reply) {
        if (err) {
            console.log(err);
            response.error = err;
            res.send(response);
        }

        // insert into mysql
        else {
            const data = {
                name: productName,
                quantity: productQuantity
            };

            pool.query('INSERT INTO products SET ?', data, function (err, result) {
                if (err) {
                    console.log(err);
                    response.error = err;
                    res.send(response);
                }
                else {
                    response.operation_successful = true;
                    res.send(response);
                }
            })
        }
    });
});


app.get('/api/getInventory', (req, res) => {
    let response = {
        "data": false,
        "error": null
    };


    pool.query('SELECT NAME, QUANTITY FROM PRODUCTS', function (err, result) {
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