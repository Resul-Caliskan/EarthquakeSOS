// src/config/mongo.js
const { MongoClient, GridFSBucket } = require('mongodb');
const config = require("./config");

const client = new MongoClient(config.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
let bucket;

async function connectToMongo() {
  try {
    await client.connect();
    const db = client.db(process.env.MONGODB_DB_NAME || 'ESOS');
    bucket = new GridFSBucket(db, { bucketName: 'audioFiles' });
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('Failed to connect to MongoDB:', err);
  }
}

function getBucket() {
  if (!bucket) {
    throw new Error('Bucket not initialized. Call connectToMongo first.');
  }
  return bucket;
}

module.exports = { connectToMongo, getBucket };
