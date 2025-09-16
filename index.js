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

// MongoDB connection
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fpvzj8u.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const client = new MongoClient(uri, {
    serverApi: { version: ServerApiVersion.v1, strict: true, deprecationErrors: true },
});

const database = client.db("E-commerce");
const electronicsProducts = database.collection("electronicsProduct");
const womenFashion = database.collection("WomenFashion");
const winterFashion = database.collection("WinterFashion");
const gadgetAndGare = database.collection("Gadgate&Gear");
const usersCollection = database.collection("users");

async function run() {
    try {
        await client.connect();

        // Electronics products
        app.get("/electronics", async (req, res) => {
            const result = await electronicsProducts.find().toArray();
            res.send(result);
        });

        // Women fashion
        app.get("/womenFashion", async (req, res) => {
            const result = await womenFashion.find().toArray();
            res.send(result);
        });

        // Winter fashion
        app.get("/winterFashion", async (req, res) => {
            const result = await winterFashion.find().toArray();
            res.send(result);
        });

        // Gadget & Gear
        app.get("/gadgetProduct", async (req, res) => {
            const result = await gadgetAndGare.find().toArray();
            res.send(result);
        });

        // Show all users
        app.get("/users", async (req, res) => {
            const result = await usersCollection.find().toArray();
            res.send(result);
        });

        // Store a new user
        app.post("/users", async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            res.send(result);
        });

        // Get a single user by email
        app.get("/users/:email", async (req, res) => {
            const email = req.params.email?.trim().toLowerCase();
            const user = await usersCollection.findOne({ email });
            if (!user) return res.status(404).json({ message: "User not found" });
            res.send(user);
        });


        // all product use aggregate 

        // server.js
        app.get("/allProducts", async (req, res) => {
            try {
                const page = parseInt(req.query.page) || 1;
                const perPage = 10;
                const skip = (page - 1) * perPage;

                const products = await electronicsProducts.aggregate([
                    { $addFields: { category: "Electronics" } },
                    { $unionWith: { coll: "WomenFashion", pipeline: [{ $addFields: { category: "WomenFashion" } }] } },
                    { $unionWith: { coll: "WinterFashion", pipeline: [{ $addFields: { category: "WinterFashion" } }] } },
                    { $unionWith: { coll: "Gadgate&Gear", pipeline: [{ $addFields: { category: "Gadgate&Gear" } }] } }
                ])
                    .skip(skip)
                    .limit(perPage)
                    .toArray();

                const totalCount = await electronicsProducts.aggregate([
                    { $addFields: { category: "Electronics" } },
                    { $unionWith: { coll: "WomenFashion", pipeline: [{ $addFields: { category: "WomenFashion" } }] } },
                    { $unionWith: { coll: "WinterFashion", pipeline: [{ $addFields: { category: "WinterFashion" } }] } },
                    { $unionWith: { coll: "Gadgate&Gear", pipeline: [{ $addFields: { category: "Gadgate&Gear" } }] } }
                ]).toArray();

                res.json({ products, total: totalCount.length });
            } catch (err) {
                console.error(err);
                res.status(500).json({ message: "Failed to fetch products" });
            }
        });





















        // Ping MongoDB
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. Successfully connected to MongoDB!");
    } finally {
        // Keep server running
    }

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

run().catch(console.dir);
