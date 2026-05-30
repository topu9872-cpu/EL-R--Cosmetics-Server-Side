require("dotenv").config();
const express = require("express");
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const port = 5000;
const cors = require("cors");
app.use(cors());
app.use(express.json());

const uri = process.env.MONGODB_URI;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const db = client.db("ELÀRÀ-cosmetics");
    const cosmeticsCollection = db.collection("elara-products");
    const cosmeticsBookingCollection = db.collection("elara-booking-cart");

    app.get("/products", async (req, res) => {
      const search = req.query.search || "";
      const page = parseInt(req.query.page) || 1;
      const limit = 12;

      const query = search ? { name: { $regex: search, $options: "i" } } : {};

      const skip = (page - 1) * limit;

      const result = await cosmeticsCollection
        .find(query)
        .skip(skip)
        .limit(limit)
        .toArray();

      const total = await cosmeticsCollection.countDocuments(query);

      res.json({
        data: result,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
      });
    });

    app.get("/products/:id", async (req, res) => {
      const { id } = req.params;
      const result = await cosmeticsCollection.findOne({
        _id: new ObjectId(id),
      });
      res.json(result);
    });

    app.get("/products", async (req, res) => {
      const result = await cosmeticsCollection.find().toArray();
      res.json(result);
    });
    // this is for booking

    app.post("/cart", async (req, res) => {
      const query = req.body;
      const result = await cosmeticsBookingCollection.insertOne(query);
      res.json(result);
    });

app.get('/cart', async(req, res)=>{
    const result=await cosmeticsBookingCollection.find().toArray();
    res.json(result)
});
app.delete('/cart/:id', async(req, res)=>{
    const {id}=req.params
    const result=await cosmeticsBookingCollection.deleteOne({_id: new ObjectId(id)})
    res.json(result)
})


    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!",
    );
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
