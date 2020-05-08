let MongoClient = require("mongodb").MongoClient;
let dbo = null;

const initMongo = async (url) => {
  if (!dbo) {
    console.log("dbo is not null");
    const mongo = await MongoClient.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    dbo = mongo.db("Library");
    console.log("Connection to Mongo established!");
  }
  return dbo;
};
module.exports = { dbo, initMongo };
