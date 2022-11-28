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
        app.get('/category/:name', async (req, res) => {
            const name = req.params.name;
            const query = { category: name };
            const findCategory = await productsCollections.find(query).toArray();
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
        app.get('/products', async (req, res) => {
            const email = req.query.email;
            const query = { sellerEmail: email }
            const result = await productsCollections.find(query).toArray();
            res.send(result);
        });



        //get all advertise products
        app.get('/advertise', async (req, res) => {
            const query = { isAd: 'yes' }
            const result = await productsCollections.find(query).toArray();
            res.send(result);
        });

        //get all buyers
        app.get('/buyers', async (req, res) => {
            const query = { role: 'user' }
            const result = await usersCollections.find(query).toArray();
            res.send(result);
        });


        //get all buyers
        app.get('/seller', async (req, res) => {
            const query = { role: 'seller' }
            const result = await usersCollections.find(query).toArray();
            res.send(result);
        });

        
        //update api 
        app.put('/seller/verify', async (req, res) => {
            const id = req.query.id;
            const filter = { _id: ObjectId(id) };
            const option = { upsert: true };
            const makeVerify = {
                $set: {
                    isVerify: 'verified'
                }
            }
            const result = await usersCollections.updateOne(filter, makeVerify, option);
            res.send(result);
        })


        //update api for advertagement
        app.put('/makeAd', async (req, res) => {
            const id = req.query.id;
            const filter = { _id: ObjectId(id) };
            const option = { upsert: true };
            const makeVerify = {
                $set: {
                    isAdd: 'yes'
                }
            }
            const result = await productsCollections.updateOne(filter, makeVerify, option);
            res.send(result);
        })


        //delete a user( buyer and seller)
        app.delete('/user/delete', async (req, res) => {
            const id = req.query.id;
            const query = { _id: ObjectId(id) }
            const result = await usersCollections.deleteOne(query);
            res.send(result);
        });

        //delete my product
        app.delete('/products/delete', async (req, res) => {
            const id = req.query.id;
            const query = { _id: ObjectId(id) }
            const result = await productsCollections.deleteOne(query);
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
