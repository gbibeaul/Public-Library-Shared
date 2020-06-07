let MongoClient = require("mongodb").MongoClient;
let dbo = null;

const initMongo = async (url, database) => {
  if (!dbo) {
    const mongo = await MongoClient.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    dbo = mongo.db(database);
    console.log("Connection to Mongo established!");
  }
  return dbo;
};
const getDb = (collectionName) => {
  if (!dbo) {
    console.log("DBO not instantated, call init please!");
    return;
  }
  return dbo.collection(collectionName);
};
module.exports = { getDb, initMongo };
