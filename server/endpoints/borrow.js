const express = require("express");
const router = express.Router();
const multer = require("multer");
const ObjectId = require("mongodb").ObjectId;
const upload = multer({ dest: __dirname + "/uploads/" });
const getDb = require("../database/database.js").getDb;

router.post("/", upload.none(), async (req, res) => {
  try {
    const sessionId = req.cookies.sid;
    const user = await getDb("sessions").findOne({ sid: sessionId });
    const itemId = req.body.id;
    const currentDate = Date.now();
    if (!user) {
      return res.send(
        JSON.stringify({ success: false, msg: "User is not active" })
      );
    }
    const email = user.email;
    const book = await getDb("books").findOne({ _id: ObjectId(itemId) });
    if (!book) {
      return res.send(
        JSON.stringify({ success: false, msg: "Item not found" })
      );
    }
    if (book.borrower === user._id.toString() && book.availability === false) {
      return res.send(
        JSON.stringify({
          success: false,
          msg: "You have already borrowed this item!",
        })
      );
    }
    if (book.borrower !== user._id.toString() && book.availability === false) {
      return res.send(
        JSON.stringify({ success: false, msg: "Item is not available" })
      );
    }
    const newBook = await getDb("books").findOneAndUpdate(
      { _id: ObjectId(itemId) },
      {
        $set: {
          availability: false,
          borrower: user._id.toString(),
          borrowedDate: currentDate,
        },
      },
      { returnOriginal: false }
    );
    await getDb("users").updateOne(
      { email: email },
      {
        $push: {
          itemsToReturn: { itemId: itemId, borrowedDate: currentDate },
        },
      }
    );
    res.send(
      JSON.stringify({
        success: true,
        book: newBook.value,
        msg: "borrowed successfully",
      })
    );
  } catch (err) {
    res.send(JSON.stringify({ success: false, msg: err }));
  }
});

module.exports = router;
