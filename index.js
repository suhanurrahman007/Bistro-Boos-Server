const express = require('express');
const cors = require('cors');
const {
    MongoClient,
    ServerApiVersion
} = require('mongodb');
require('dotenv').config()

const app = express()
const port = process.env.PORT || 5000
//  Middleware
app.use(express.json())
app.use(cors())


const uri = `mongodb+srv://${process.env.DB_BISTRO_BOSS_USER}:${process.env.DB_BISTRO_BOSS_PASS}@cluster0.33tct4k.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        const menuCollection = client.db("menuDB").collection("menu")
        const reviewCollection = client.db("menuDB").collection("review")
        const cartCollection = client.db("menuDB").collection("cart")




        app.get("/menu", async(req, res) =>{
            const result = await menuCollection.find().toArray()
            res.send(result)
        })

        app.get("/review", async (req, res) => {
            const result = await reviewCollection.find().toArray()
            res.send(result)
        })

        app.get("/cart", async(req, res) =>{
            const result = await cartCollection.find().toArray()
            res.send(result)
        })

        app.post("/cart", async (req, res) =>{
            const cart = req.body
            const result = await cartCollection.insertOne(cart)
            res.send(result)
        })




        // Send a ping to confirm a successful connection
        await client.db("admin").command({
            ping: 1
        });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);

app.get("/", (req, res)=>{
    res.send("Bistro Server is Running")
})
app.listen(port, ()=>{
    console.log(`Bistro Boss Server Running Port is ${port}`);
})