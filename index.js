require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Basic route
app.get("/", (req, res) => {
    res.send("Hello, Express server is running!");
});

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fpvzj8u.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with options
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});


const database = client.db("E-commerce");
const electronicsProducts = database.collection("electronicsProduct");
const womenFashion = database.collection("WomenFashion")
const winterFashion = database.collection('WinterFashion')
const gadgetAndGare = database.collection('Gadgate&Gear') 
const usersCollection = database.collection('users')

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        // for electronics product

        app.get('/electronics', async (req, res) =>{
            const result = await electronicsProducts.find().toArray();
            res.send(result);

        })


        // for women fashions

        app.get('/womenFashion', async(req, res)=>{
            const result = await womenFashion.find().toArray();
            res.send(result);
        })

        // dor winterFashion

        app.get('/winterFashion', async(req, res) =>{
            const result = await winterFashion.find().toArray();
            res.send(result);
        })

        // for gadget&Gare

        app.get('/gadgetProduct', async(req, res) =>{
            const result = await gadgetAndGare.find().toArray();
            res.send(result)
        })

        // show user
        app.get('/users', async(req, res) => {
            const result = await usersCollection.find().toArray();
            res.send(result);
        })


        // for users store in database
        app.post('/users', async(req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            res.send(result);
        })





         app.get("/users/:email", async(req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const user = await usersCollection.findOne(query);
            res.send(user);
        });

























        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }



    app.listen(PORT, () => {
        console.log("Server is running");
    });






}
run().catch(console.dir);
