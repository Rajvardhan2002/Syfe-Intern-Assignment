const { MongoClient } = require('mongodb');
const mongodb = require('mongodb');

// const ObjectId = mongodb.ObjectId;


const url = "mongodb+srv://somil:somil@cluster0.3z100vt.mongodb.net/?retryWrites=true&w=majority";
const database = 'rajasthan';
const client = new MongoClient(url);
let db;

///fetching and populating dropdown menu
async function connectToDatabase() {
    let result = await client.connect();
     db = result.db(database);
    // let collection = db.collection('olddatas');
    // let response = await collection.find({},{ projection: { collegeName: 1 }}).toArray();
    // console.log(db);
    // return db;
}

function getDb() {
    if (!db) {
      throw new Error('You must connect first!');
    }
  
    return db;
  }

module.exports = {
    getDb : getDb,
    connectToDatabase : connectToDatabase,
}