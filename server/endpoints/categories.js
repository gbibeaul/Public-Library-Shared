const express = require("express");
const router = express.Router();
const getDb = require("../database/database.js").getDb;

router.get("/", async (req, res) => {
  let dbo = getDb();
  try {
    const books = await dbo.collection("books").find({}).toArray();
    const categories = Object.keys(
      books.reduce((acc, book) => {
        book.categories.forEach((category) => {
          if (!category) return;
          acc[category.toUpperCase()] = true; // the value true is not important. It's just because i can't add a key without a value
        });
        return acc;
      }, {})
    );
    res.send(JSON.stringify({ success: true, categories: categories }));
  } catch (err) {
    res.send(JSON.stringify({ success: false, msg: err }));
  }
});
module.exports = router;
