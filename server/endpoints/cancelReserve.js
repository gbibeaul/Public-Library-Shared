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
  try {
    const alreadyReserved = await getDb("books").findOne({
      _id: ObjectId(itemId),
      reservations: user._id.toString(),
    });
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
    const book = await getDb("books").findOneAndUpdate(
      {
        _id: ObjectId(itemId),
        reservations: user._id.toString(),
      },
      { $pull: { reservations: user._id.toString() } },
      { returnOriginal: false }
    );
    await getDb("users").updateOne(
      { _id: user._id.toString(), reservedItems: itemId },
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
