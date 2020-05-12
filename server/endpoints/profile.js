const ObjectId = require("mongodb").ObjectId;
const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: __dirname + "/uploads/" });
const getDb = require("../database/database.js").getDb;

router.get("/", async (req, res) => {
  const dbo = getDb();
  const sessionId = req.cookies.sid;
  const activeUser = await dbo
    .collection("sessions")
    .findOne({ sid: sessionId });
  if (!activeUser) {
    return res.send(
      JSON.stringify({ success: false, msg: "User is not active" })
    );
  }
  try {
    const user = await dbo
      .collection("users")
      .findOne({ _id: ObjectId(sessionId) });
    const historyIds = user.itemsHistory.map((record) => record.itemId);
    const toReturnIds = user.itemsToReturn.map((record) => record.itemId);
    const mergedData = historyIds
      .concat(toReturnIds)
      .concat(user.reservedItems);
    const reducedData = [...new Set(mergedData)];
    const fullReducedData = await dbo
      .collection("books")
      .find({ _id: { $in: reducedData.map((id) => ObjectId(id)) } })
      .toArray();
    user.itemsHistory = user.itemsHistory.map((item) => {
      const matchItem = fullReducedData.find(
        (book) =>
          ObjectId(book._id).toString() === ObjectId(item.itemId).toString()
      );
      item._id = matchItem._id;
      item.title = matchItem.title;
      item.isbn = matchItem.isbn;
      return item;
    });
    user.itemsToReturn = user.itemsToReturn.map((item) => {
      const matchItem = fullReducedData.find(
        (book) =>
          ObjectId(book._id).toString() === ObjectId(item.itemId).toString()
      );
      item._id = matchItem._id;
      item.title = matchItem.title;
      item.isbn = matchItem.isbn;
      return item;
    });
    user.reservedItems = user.reservedItems.map((id) => {
      const matchItem = fullReducedData.find(
        (book) => ObjectId(book._id).toString() === id.toString()
      );
      const reducer = (accumulator, currentValue) => accumulator + currentValue;
      const avgDaysToReturn = matchItem.borrowedDays.reduce(reducer);
      console.log(avgDaysToReturn);
      const userReservationIndex = matchItem.reservations.findIndex(
        (id) => id.toString() === sessionId.toString()
      );
      console.log(userReservationIndex);
      const item = {};
      item.itemId = matchItem._id.toString();
      item.title = matchItem.title;
      item.isbn = matchItem.isbn;
      item.estimatedAvailability =
        (avgDaysToReturn === 0 ? 30 : avgDaysToReturn) *
          (userReservationIndex + 1) *
          86400000 +
        matchItem.borrowedDate;

      return item;
    });
    res.send(
      JSON.stringify({
        success: true,
        user: user,
        itemsHistory: user.itemsHistory,
        itemsToReturn: user.itemsToReturn,
        reservedItems: user.reservedItems,
      })
    );
  } catch (err) {
    res.send(JSON.stringify({ success: false, msg: err }));
  }
});

module.exports = router;
