require("dotenv").config();
let express = require("express");
let app = express();
let cookieParser = require("cookie-parser");

let initMongo = require("./database/database.js").initMongo;

let dbo = undefined;

let url = process.env.SERVER_PATH;

app.use(cookieParser());

// Signup
const signup = require("./endpoints/signup.js");
app.use("/signup", signup);

// Login
const login = require("./endpoints/login.js");
app.use("/login", login);

//Active Session
const sessions = require("./endpoints/sessions.js");
app.use("/sessions", sessions);

//Logout
const logout = require("./endpoints/logout.js");
app.use("/logout", logout);

// Get Categories
const categories = require("./endpoints/categories.js");
app.use("/categories", categories);

// Get all items
const items = require("./endpoints/items.js");
app.use("/items", items);

// Get only 1 item
const item = require("./endpoints/item.js");
app.use("/item", item);

// Borrow a book
const borrowItem = require("./endpoints/borrow.js");
app.use("/borrow", borrowItem);

// Return a book
const returnItem = require("./endpoints/return.js");
app.use("/return", returnItem);

// Reserve a book
const reserveItem = require("./endpoints/reserve.js");
app.use("/reserve", reserveItem);

// Cancel a reserve
const cancelReserve = require("./endpoints/cancelReserve.js");
app.use("/cancelReserve", cancelReserve);

// Profile
const profile = require("./endpoints/profile.js");
app.use("/profile", profile);

// Contact us
const contact = require("./endpoints/contact.js");
app.use("/contact", contact);

// Your endpoints go before this line

let listener;
let start = async (database) => {
  await initMongo(url, database).then((response) => {
    dbo = response;
    listener = app.listen(4000, "0.0.0.0", () => {
      console.log("Server running");
    });
  });
};
let close = () => {
  listener.close();
};

start()

module.exports = { app, start, close };
