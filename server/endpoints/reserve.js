const ObjectId = require("mongodb").ObjectId;
const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: __dirname + "/uploads/" });
const getDb = require("../database/database.js").getDb;

router.post("/", upload.none(), async (req, res) => {
  try {
    const sessionId = req.cookies.sid;
    const user = await getDb("sessions").findOne({ sid: sessionId });
    const itemId = req.body.id;
    if (!user) {
      return res.send(
        JSON.stringify({ success: false, msg: "User is not active" })
      );
    }
    const email = user.email;
    const item = await getDb("books").findOne({
      _id: ObjectId(itemId),
    });
    if (item.reservations.includes(user._id.toString())) {
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
    if (item.borrower === user._id.toString()) {
      return res.send(
        JSON.stringify({
          success: false,
          msg: "You already borrowed this book!",
        })
      );
    }

    const book = await getDb("books").findOneAndUpdate(
      { _id: ObjectId(itemId), reservations: { $nin: [user._id.toString()] } },
      { $push: { reservations: user._id.toString() } },
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
