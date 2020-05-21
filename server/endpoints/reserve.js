const ObjectId = require("mongodb").ObjectId;
const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: __dirname + "/uploads/" });
const getDb = require("../database/database.js").getDb;

router.post("/", upload.none(), async (req, res) => {
  const sessionId = req.cookies.sid;
  const user = await getDb("sessions").findOne({ sid: sessionId });
  const itemId = req.body.id;
  if (!user) {
    return res.send(
      JSON.stringify({ success: false, msg: "User is not active" })
    );
  }
  const email = user.email;
  try {
    const item = await getDb("books").findOne({
      _id: ObjectId(itemId),
    });
    if (item.reservations.includes(sessionId)) {
      return res.send(
        JSON.stringify({
          success: false,
          msg: "You already reserved this book!",
        })
      );
    }
    if (!item.borrower) {
      return res.send(
        JSON.stringify({
          success: false,
          msg: "Can't reserve an available item!",
        })
      );
    }
    if (item.borrower === sessionId) {
      return res.send(
        JSON.stringify({
          success: false,
          msg: "You already borrowed this book!",
        })
      );
    }

    const book = await getDb("books").findOneAndUpdate(
      { _id: ObjectId(itemId), reservations: { $nin: [sessionId] } },
      { $push: { reservations: sessionId } },
      { returnOriginal: false }
    );
    await getDb("users").updateOne(
      { email: email, reservedItems: { $nin: [itemId] } },
      { $push: { reservedItems: itemId } }
    );
    res.send(
      JSON.stringify({
        success: true,
        book: book.value,
        msg: "Reserved successfully",
      })
    );
  } catch (err) {
    res.send(JSON.stringify({ success: false, msg: "Action failed!" }));
  }
});

module.exports = router;
