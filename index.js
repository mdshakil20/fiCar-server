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

        //get first 3 categories for homepage
        app.get('/homeCategories', async (req, res) => {
            const query = {};
            const result = await categoriesCollection.find(query).toArray();
            res.send(result);
        });

        //get cars by category
        app.get('/category/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id : ObjectId(id)};
            const findCategory = await categoriesCollection.find(query).toArray();
            res.send(findCategory);
        });

        //user information store method
        app.post('/user', async(req, res)=>{
            const user = req.body;
            const result = await usersCollections.insertOne(user);
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
