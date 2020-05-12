const express = require("express");
const router = express.Router();
const getDb = require("../database/database.js").getDb;

router.get("/", async (req, res) => {
  let dbo = getDb();
  let id = req.query.id;
  try {
    let item = await dbo.collection("books").findOne({ _id: ObjectId(id) });
    res.send(JSON.stringify({ success: true, item: item }));
  } catch (err) {
    res.send(JSON.stringify({ success: false, msg: err }));
  }
});

module.exports = router;
