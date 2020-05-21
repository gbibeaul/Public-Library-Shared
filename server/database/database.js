let MongoClient = require("mongodb").MongoClient;
let dbo = null;
let booksDb = null;
let userDb = null;
let sessionsDb = null;

const initMongo = async (url) => {
  if (!dbo) {
    const mongo = await MongoClient.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    dbo = mongo.db("Library");
    console.log("Connection to Mongo established!");
    console.log("dbo", dbo);
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
