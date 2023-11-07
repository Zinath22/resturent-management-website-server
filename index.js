const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000;

// middleware 
app.use(cors());
app.use(express.json())



// resturentManagement
// 9b6gEpbZRi7Yebhv

// console.log(process.env.DB_USER)



// last 
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.w2tuwt2.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   }
// });
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
    // await client.connect();

    const foodCollection = client.db('resturentDB').collection('allFood');
    const purchaseCollection = client.db('resturentDB').collection('purchase');
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
    
// add 
    app.post('/allFood', async(req, res)=> {
      const newFood = req.body;
      console.log(newFood);
      const result = await foodCollection.insertOne(newFood);
      res.send(result); 
    })

    // update 
    app.put('/allFood', async(req, res) => {
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)}
      const options = { upsert: true};
      const updateFood = req.body;
      const food = {
        $set: {
     
           food_name : updateFood.food_name,
        food_category : updateFood.food_category,
           quantity : updateFood.quantity,
           food_description : updateFood.food_description,
           price : updateFood.price,
          added_by_name : updateFood.added_by_name,
           added_by_email : user?.email, // Make sure user is defined
           food_img : updateFood.food_img,
          food_origin : updateFood.food_origin
        }
      }
     const result = await foodCollection.updateOne(filter, food, options);
     res.send(result);
    })


    


    //  // addfood 
    //  app.post('/allFood', async(res, res) => {
    //   const newFood = req.body;
    //   console.log(newFood)
    //   const result = await foodCollection.insertOne()
    // })

    //  purchase 

    app.get('/purchase', async (req, res) => {
      const cursor = purchaseCollection.find();
      const result = await cursor.toArray();
      res.send(result);

  });
  

  app.get('/purchase/:id', async(req, res) =>{
    const id = req.params.id;
    const query ={_id: new ObjectId(id)}
    const result = await purchaseCollection.findOne(query);
    res.send(result);
    });


    app.post('/purchase', async (req, res) => {
      const booking = req.body;
      console.log(booking);
      const result = await purchaseCollection.insertOne(booking);
      res.send(result);
    });

    


   
    


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