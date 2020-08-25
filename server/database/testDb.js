require("dotenv").config({ path: "./.env" });
const path = require("path");
process.env.DEBUG = "mongo-seeding";
const { Seeder } = require("mongo-seeding");

const config = {
  database: process.env.TEST_PATH,
  dropDatabase: true,
};
const seeder = new Seeder(config);
const collections = seeder.readCollectionsFromPath(path.resolve("./mockData"), {
  //    transformers: [Seeder.Transformers.replaceDocumentIdWithUnderscoreId],
});

const mySeeder = async () => {
  await seeder
    .import(collections)
    .then(() => {
      console.log("Success");
    })
    .catch((err) => {
      console.log("Error", err);
    });
};

module.exports = mySeeder;
