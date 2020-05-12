const ObjectId = require("mongodb").ObjectId;
const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: __dirname + "/uploads/" });
const getDb = require("../database/database.js").getDb;

router.post("/", upload.none(), async (req, res) => {
  const dbo = getDb();
  const sessionId = req.cookies.sid;
  const user = await dbo.collection("sessions").findOne({ sid: sessionId });
  const itemId = req.body.id;
  if (!user) {
    return res.send(
      JSON.stringify({ success: false, msg: "User is not active" })
    );
  }
  const email = user.email;
  try {
    const alreadyReserved = await dbo.collection("books").findOne({
      _id: ObjectId(itemId),
      reservations: sessionId,
    });
    console.log(alreadyReserved);
    if (!alreadyReserved) {
      return res.send(
        JSON.stringify({
          success: false,
          msg: "Item is not in your reservation to unreserve!",
        })
      );
    }
  } catch (err) {
    res.send(JSON.stringify({ success: false, msg: err }));
  }
  try {
    const book = await dbo.collection("books").findOneAndUpdate(
      {
        _id: ObjectId(itemId),
        reservations: sessionId,
      },
      { $pull: { reservations: sessionId } },
      { returnOriginal: false }
    );
    console.log("book", book.value);
    await dbo
      .collection("users")
      .updateOne(
        { _id: ObjectId(sessionId), reservedItems: itemId },
        { $pull: { reservedItems: itemId } }
      );
    res.send(
      JSON.stringify({
        success: true,
        book: book.value,
        msg: "Un-Reserved Successfully",
      })
    );
  } catch (err) {
    res.send(JSON.stringify({ success: false, msg: err }));
  }
});

module.exports = router;
