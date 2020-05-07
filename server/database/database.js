require("dotenv").config({ path: ".../.env" });
let MongoClient = require("mongodb").MongoClient;

// Reuseable connection object that gets assinged on init
// on initMongo is called (preferably at application start)
// theh connection will be available whereever it's imported
let dbo = null;
const initMongo = async (url) => {
  // if connection is null, assign it to a new mongo connection
  // else do nothing
  if (!dbo) {
    const mongo = await MongoClient.connect(process.env.SERVER_PATH, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    dbo = mongo.db("Library");
    console.log("Connection to Mongo established!");
  }
  return;
};

module.exports = { dbo, initMongo };
