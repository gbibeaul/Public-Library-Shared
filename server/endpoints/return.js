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
  const borrowedDate = Number(req.body.borrowedDate);
  const currentDate = Date.now();
  const borrowedDays = Math.round((currentDate - borrowedDate) / 86400000);
  if (!user) {
    return res.send(
      JSON.stringify({ success: false, msg: "User is not active" })
    );
  }
  const email = user.email;
  const item = await getDb("books").findOne({
    _id: ObjectId(itemId),
    borrower: user._id.toString(),
  });
  if (!item) {
    return res.send(JSON.stringify({ success: false, msg: "Item not found" }));
  }
  // if no one is in the reservations list:
  if (!item.reservations[0]) {
    try {
      const book = await getDb("books").findOneAndUpdate(
        { _id: ObjectId(itemId) },
        {
          $set: {
            availability: true,
            borrower: undefined,
            borrowedDate: undefined,
          },
          $push: { borrowedDays: borrowedDays },
        },
        { returnOriginal: false }
      );
      await getDb("users").updateOne(
        { email: email },
        {
          $push: {
            itemsHistory: {
              itemId: itemId,
              borrowedDate: borrowedDate,
              returnedDate: currentDate,
            },
          },
          $pull: { itemsToReturn: { itemId: itemId } },
        }
      );
      res.send(
        JSON.stringify({
          success: true,
          book: book.value,
          msg: "returned successfully",
        })
      );
    } catch (err) {
      res.send(JSON.stringify({ success: false, msg: err }));
    }
    return;
  }
  //if someone is in the reservation list:
  try {
    const newBorrower = item.reservations[0];
    const book = await getDb("books").findOneAndUpdate(
      { _id: ObjectId(itemId) },
      {
        $set: {
          borrower: newBorrower,
          borrowedDate: currentDate,
        },
        $push: { borrowedDays: borrowedDays },
        $pull: { reservations: newBorrower },
      },
      { returnOriginal: false }
    );
    await getDb("users").updateOne(
      { email: email },
      {
        $push: {
          itemsHistory: {
            itemId: itemId,
            borrowedDate: borrowedDate,
            returnedDate: currentDate,
          },
        },
        $pull: { itemsToReturn: { itemId: itemId } },
      }
    );
    console.log(newBorrower);
    await getDb("users").updateOne(
      {
        _id: ObjectId(newBorrower),
      },
      {
        $push: {
          itemsToReturn: { itemId: itemId, borrowedDate: currentDate },
        },
        $pull: { reservedItems: itemId },
      }
    );
    res.send(
      JSON.stringify({
        success: true,
        book: book.value,
        msg: "returned successfully",
      })
    );
  } catch (err) {
    res.send(JSON.stringify({ success: false, msg: err }));
  }
});

module.exports = router;
