const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: __dirname + "/uploads/" });
const dbo = require("../database/database.js").dbo;
// const initMongo = require("../database/database.js").initMongo;

router.post("/", upload.none(), async (req, res) => {
  let body = JSON.parse(req.body.user);
  let email = body.email;
  let name = body.name;
  let password = body.password;
  let image = body.image;
  try {
    let user = await dbo.collection("users").findOne({ email: email });
    if (user) {
      console.log("/SignUp Error - Username is already taken!");
      res.send(
        JSON.stringify({ success: false, msg: "Username is already taken!" })
      );
      return;
    }
    let sessionId;
    await dbo
      .collection("users")
      .insertOne({
        email: email,
        name: name,
        password: sha1(password),
        img: image,
        itemsHistory: [],
        itemsToReturn: [],
        reservedItems: [],
      })
      .then((result) => (sessionId = "" + result.insertedId));

    sessions[sessionId] = email;
    res.cookie("sid", sessionId);
    res.send(
      JSON.stringify({
        success: true,
        msg: "Login Successful!",
        name: name,
        email: email,
        id: sessionId,
      })
    );
  } catch (err) {
    console.log("/SignUp Error", err);
    res.send(JSON.stringify({ success: false, msg: err }));
  }
});
module.exports = router;
