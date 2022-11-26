const express = require('express');
const cors = require('cors');
const { application } = require("express");
const { MongoClient, ServerApiVersion } = require('mongodb');
const port = process.env.PORT || 5000;

const app = express();
require('dotenv').config();

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@cluster0.davow0l.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const categoriesCollection = client.db('fiCar').collection('categories');
        
    }
    finally { }

}

run().catch(err => console.error(err))


app.get('/', async (req, res) => {
    res.send('FiCar server is running...')
})

app.listen(port, () => console.log(`server port ${port}`))
