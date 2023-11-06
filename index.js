const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000;

// middleware 
app.use(cors());
app.use(express.json())

// ZGsn7nDoreYmObrS
// resturentManagement

// zinathfarhana22

// SNjaSaFFA8zlnG8Q



const uri = "mongodb+srv://zinathfarhana22:SNjaSaFFA8zlnG8Q@cluster0.w2tuwt2.mongodb.net/?retryWrites=true&w=majority";
console.log(uri);

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

    const foodCollection = client.db('resturentDB').collection('allFood');
    // const pageCollection = client.db('resturentDB').collection('foodPage');
// overall api 
    // app.get('/allFood', async(req, res) => {
    //   const cursor = foodCollection.find();
    //   const page = parseInt(req.query.page);
    //   const size = parseInt(req.query.size)
    //   console.log(req.query);

    //   const result = await cursor.toArray();
    //   res.send(result);
    // });

    app.get('/allFood', async(req, res) => {
      // const cursor = foodCollection.find();
      const page = parseInt(req.query.page);
      const size = parseInt(req.query.size)
      // console.log(req.query);

      const result = await foodCollection.find()
      .skip(page * size)
      .limit(size)
      .toArray();
      res.send(result);
    });
    
    // details page 
    app.get('/allFood/:id', async(req, res) =>{
      const id = req.params.id;
      const query ={_id: new ObjectId(id)}
      const result = await foodCollection.findOne(query);
      res.send(result);
      });

      // allfood / pagination page api 

      app.get('/foodCount', async(req, res) => {
        const count = await foodCollection.estimatedDocumentCount();
        res.send({count});

      })
    

    app.post('/allFood', async(req, res)=> {
      const newFood = req.body;
      console.log(newFood);
      const result = await foodCollection.insertOne(newFood);
      res.send(result);
    })

     
    


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('SIMPLE RESTURENT IS RUNNING')
})

app.listen(port, () =>{
    console.log(`RESTURENT WEBSITE is running on port, ${port}`)
})