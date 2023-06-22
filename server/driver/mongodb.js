const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = "mongodb+srv://rawr:wgCKYDboVNcmyzhb@cluster0.dwtz3jm.mongodb.net/?retryWrites=true&w=majority"; // Replace with your MongoDB connection string
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });

let db;
async function connectToMongoDB() {
  try {
    await client.connect();
    db = client.db('shop');
    await client.db("shop").command({ ping: 1 });
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
  }
}

function getDB() {
  return db;
}
module.exports = {
  connectToMongoDB,
  getDB,
};
