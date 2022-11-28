const express = require('express');
const cors = require('cors');
const { application } = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;

const app = express();
require('dotenv').config();

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.davow0l.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const categoriesCollection = client.db('fiCar').collection('categories');
        const usersCollections = client.db('fiCar').collection('users');
        const productsCollections = client.db('fiCar').collection('products');

        //get first 3 categories for homepage
        app.get('/homeCategories', async (req, res) => {
            const query = {};
            const result = await categoriesCollection.find(query).toArray();
            res.send(result);
        });

        //get all categories
        app.get('/allCategory', async (req, res) => {
            const query = {};
            const result = await categoriesCollection.find(query).toArray();
            res.send(result);
        });

        //get cars by category
        app.get('/category/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const findCategory = await categoriesCollection.find(query).toArray();
            res.send(findCategory);
        });


        //user information read method
        app.get('/user/:email', async (req, res) => {
            const uemail = req.params.email;
            console.log(uemail);
            const query = { email: uemail }
            const result = await usersCollections.find(query).toArray();
            console.log(result);
            res.send(result);
        });

        //user information write method
        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollections.insertOne(user);
            res.send(result);
        })

        //get for my products
        app.get('/user/:email', async (req, res) => {
            const uemail = req.params.email;
            console.log(uemail);
            const query = { email: uemail }
            const result = await usersCollections.find(query).toArray();
            console.log(result);
            res.send(result);
        });
        //product add -- write method
        app.post('/products', async (req, res) => {
            const item = req.body;
            const result = await productsCollections.insertOne(item);
            res.send(result);
        })
    }
    finally { }

}

run().catch(err => console.error(err))


app.get('/', async (req, res) => {
    res.send('FiCar server is running...')
})

app.listen(port, () => console.log(`server port ${port}`))
