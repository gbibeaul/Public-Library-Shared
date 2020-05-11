require("dotenv").config({ path: "../.env" });
let express = require("express");
let app = express();
let ObjectId = require("mongodb").ObjectId;
let multer = require("multer");
let upload = multer({ dest: __dirname + "/uploads/" });
let cookieParser = require("cookie-parser");
let sha1 = require("sha1");
let dbo = undefined;
let initMongo = require("./database/database.js").initMongo;
let url = process.env.SERVER_PATH;
let sessions = {};
let getSessions = () => {
  return sessions;
};
console.log(sessions);
app.use(cookieParser());
app.use("/", express.static("build")); // Needed for the HTML and JS files
app.use("/", express.static("./public")); // Needed for local assets
app.use("/uploads", express.static("uploads"));

// Your endpoints go after this line

// Signup
const signup = require("./endpoints/signup.js");
app.use("/signup", signup);

// Login
const login = require("./endpoints/login.js");
app.use("/login", login);

//Active Session
app.get("/sessions", async (req, res) => {
  const sessionId = req.cookies.sid;
  const email = sessions[sessionId];
  console.log("sessions", sessions);
  try {
    const user = await dbo.collection("users").findOne({ email: email });
    email
      ? res.send(
          JSON.stringify({
            success: true,
            email: email,
            name: user.name,
            id: user._id,
            msg: "User is active",
          })
        )
      : res.send(JSON.stringify({ success: false, msg: "User is not active" }));
  } catch (err) {
    console.log("/Session Error", err);
    res.send(JSON.stringify({ success: false, msg: err }));
  }
});

//Logout
app.get("/logout", (req, res) => {
  const sessionId = req.cookies.sid;
  const email = sessions[sessionId];
  if (!email)
    return res.send(
      JSON.stringify({ success: false, msg: "You To Login First!" })
    );
  delete sessions[sessionId];
  res.send(
    JSON.stringify({ success: true, msg: "You Have Logged Out Successfully" })
  );
});
// Get Categories
app.get("/categories", async (req, res) => {
  console.log(1);
  try {
    const books = await dbo.collection("books").find({}).toArray();
    const categories = Object.keys(
      books.reduce((acc, book) => {
        book.categories.forEach((category) => {
          if (!category) return;
          acc[category.toUpperCase()] = true; // the value true is not important. It's just because we can't add a key without a value
        });
        console.log(acc);
        return acc;
      }, {})
    );
    console.log("cat", categories);
    res.send(JSON.stringify({ success: true, categories: categories }));
  } catch (err) {
    res.send(JSON.stringify({ success: false, msg: err }));
  }
});

// Get all items
app.get("/items", async (req, res) => {
  try {
    const items = await dbo.collection("books").find({}).toArray();
    res.send(JSON.stringify({ success: true, items: items }));
  } catch (err) {
    res.send(JSON.stringify({ success: false, msg: err }));
  }
});

// Get only 1 item
app.get("/item", async (req, res) => {
  const id = req.query.id;
  try {
    const item = await dbo.collection("books").findOne({ _id: ObjectId(id) });
    res.send(JSON.stringify({ success: true, item: item }));
  } catch (err) {
    res.send(JSON.stringify({ success: false, msg: err }));
  }
});
// Borrow a book
app.post("/borrow", upload.none(), async (req, res) => {
  const sessionId = req.cookies.sid;
  const email = sessions[sessionId];
  const itemId = req.body.id;
  const currentDate = Date.now();
  if (!email) {
    return res.send(
      JSON.stringify({ success: false, msg: "User is not active" })
    );
  }
  try {
    const book = await dbo.collection("books").findOneAndUpdate(
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
    await dbo.collection("users").updateOne(
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
// Return a book
app.post("/return", upload.none(), async (req, res) => {
  const sessionId = req.cookies.sid;
  const email = sessions[sessionId];
  const itemId = req.body.id;
  const borrowedDate = Number(req.body.borrowedDate);
  const currentDate = Date.now();
  console.log(currentDate);
  const borrowedDays = Math.round((currentDate - borrowedDate) / 86400000);
  console.log("day", borrowedDays);
  if (!email) {
    return res.send(
      JSON.stringify({ success: false, msg: "User is not active" })
    );
  }
  const item = await dbo
    .collection("books")
    .findOne({ _id: ObjectId(itemId), borrower: sessionId });
  if (!item) {
    return res.send(JSON.stringify({ success: false, msg: "Item not found" }));
  }
  // if no one is in the reservations list:
  if (!item.reservations[0]) {
    try {
      const book = await dbo.collection("books").findOneAndUpdate(
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
      await dbo.collection("users").updateOne(
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
    const book = await dbo.collection("books").findOneAndUpdate(
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
    await dbo.collection("users").updateOne(
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
    await dbo.collection("users").updateOne(
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
// Reserve a book
app.post("/reserve", upload.none(), async (req, res) => {
  const sessionId = req.cookies.sid;
  const email = sessions[sessionId];
  const itemId = req.body.id;
  if (!email) {
    return res.send(
      JSON.stringify({ success: false, msg: "User is not active" })
    );
  }
  try {
    const item = await dbo.collection("books").findOne({
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

    const book = await dbo
      .collection("books")
      .findOneAndUpdate(
        { _id: ObjectId(itemId), reservations: { $nin: [sessionId] } },
        { $push: { reservations: sessionId } },
        { returnOriginal: false }
      );
    await dbo
      .collection("users")
      .updateOne(
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
// Cancel a reserve
app.post("/cancelReserve", upload.none(), async (req, res) => {
  const sessionId = req.cookies.sid;
  const email = sessions[sessionId];
  const itemId = req.body.id;
  if (!email) {
    return res.send(
      JSON.stringify({ success: false, msg: "User is not active" })
    );
  }
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
// Profile
app.get("/profile", async (req, res) => {
  const sessionId = req.cookies.sid;
  const email = sessions[sessionId];
  if (!email) {
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
app.post("/contact", upload.none(), async (req, res) => {
  let body = JSON.parse(req.body.contact);
  if (!body.email || !body.message) {
    res.send({ success: false, msg: "Mandatory fields are not filled" });
    return;
  }
  try {
    await dbo.collection("messages").insertOne({
      name: body.name,
      email: body.email,
      phone: body.phone,
      message: body.message,
    });
    res.send(
      JSON.stringify({
        success: true,
        msg: "Message has been sent successfully",
      })
    );
  } catch (err) {
    res.send(JSON.stringify({ success: false, msg: err }));
  }
});

// // Your endpoints go before this line

initMongo(url).then((response) => {
  dbo = response;
  app.listen(4000, "0.0.0.0", () => {
    console.log("Server running on port 4000");
  });
});

module.exports = getSessions;
