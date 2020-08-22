const express = require('express');
const app = express();
const port = 3001;
const bodyParser = require('body-parser');
const redis = require('redis')
const redis_client = redis.createClient()

app.use(bodyParser.json());


// Method will delete list of incoming product names;
app.post('/delete', (req, res) => {
    const toBeDeleted = req.body.productNames;

    for (i = 0; i < toBeDeleted.length; i++) {
        redis_client.DEL(toBeDeleted[i]);
    }
    res.send("SUCCESS");
});

//Method will add list of incoming products;
app.post('/add', (req, res) => {

    const productName = req.body.productName;
    const productQuantity = req.body.productQuantity;
    redis_client.set(productName, productQuantity, function (err, reply) {
        if (reply === "OK") {
            res.send("SUCCESS");
        }
        else {
            throw new Error("Something went wrong. Try again.");
        }
    })
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});