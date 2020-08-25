const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: __dirname + "/uploads/" });
const getDb = require("../database/database.js").getDb;

router.post("/", upload.none(), async (req, res) => {
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
  try {
    const book = await getDb("books").findOneAndUpdate(
      { _id: ObjectId(itemId) },
      {
        $set: {
          availability: false,
          borrower: sessionId,
          borrowedDate: currentDate,
        },
      },
      { returnOriginal: false }
    );
    if (!book) {
      return res.send(
        JSON.stringify({ success: false, msg: "Item not found" })
      );
    }
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
        book: book.value,
        msg: "borrowed successfully",
      })
    );
  } catch (err) {
    res.send(JSON.stringify({ success: false, msg: err }));
  }
});

module.exports = router;