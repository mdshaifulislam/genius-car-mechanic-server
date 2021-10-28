const express = require("express");
const { MongoClient } = require('mongodb');
require("dotenv").config();
const cors = require("cors");
const ObjectId = require('mongodb').ObjectId;

const app = express();
const port = process.env.PORT || 5000;

// middleware we use here
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ylakt.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

// console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        // console.log('connected to database');
        const database = client.db("carMechanic");
        const servicesCollection = database.collection("services");

        // GET API
        app.get('/services', async (req, res) => {
            const cursor = servicesCollection.find({});
            const result = await cursor.toArray();
            res.send(result);
        })
        // GET SINGLE SERVICE
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            // console.log("params hitted", id)

            const query = { _id: ObjectId(id) }
            const service = await servicesCollection.findOne(query)
            res.json(service)

        })
        // Delete single service
        app.delete('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await servicesCollection.deleteOne(query)
            res.json(result)

        })

        // POST api
        app.post('/services', async (req, res) => {
            const service = req.body;
            console.log('hit the post api', service);
            const result = await servicesCollection.insertOne(service)
            // console.log(result)
            // res.send('post hitted')
            res.json(result)
        })


    }
    finally {
        // await client.close();
    }

}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Running genius server');
})

app.get('/hello', (req, res) => {
    res.send('hello updated heroku check')
})
app.get('/hi', (req, res) => {
    res.send('ckecked')
})

app.listen(port, () => {
    console.log("running genius server on port", port)
})