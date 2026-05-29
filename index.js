require('dotenv').config()
const express = require('express')
const app = express()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


const port = 5000;
const cors = require('cors');
app.use(cors());
app.use(express.json());

const uri = process.env.MONGODB_URI;

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
        const db = client.db('ELÀRÀ-cosmetics');
        const cosmeticsColection = db.collection('elara-products');

        app.get('/products', async (req, res) => {
            const result = await cosmeticsColection.find().toArray();
            res.json(result)
        })

        app.get('/products', async (req, res) => {
            const search = req.query.search || '';
            const query = {
                name: {
                    $regex: search,
                    $options: 'i'
                }
            }
            const result = await cosmeticsColection.find(query).toArray()
            res.json(result)
        });

        app.get('/products/:id', async (req, res) => {
            const { id } = params;
            const result = await cosmeticsColection.findOne({ _id: new ObjectId(id) });
            res.json(result);
        })




        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {

    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})