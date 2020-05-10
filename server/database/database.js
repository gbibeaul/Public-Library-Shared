let MongoClient = require("mongodb").MongoClient;
let dbo = null;

const initMongo = async (url) => {
  if (!dbo) {
    const mongo = await MongoClient.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    dbo = mongo.db("Library");
    console.log("Connection to Mongo established!");
  }
  return dbo;
};
const getDb = () => {
  if (!dbo) {
    console.log("DBO not instantated, call init please!");
    return;
  }
  return dbo;
};
module.exports = { getDb, initMongo };
