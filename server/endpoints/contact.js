const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: __dirname + "/uploads/" });
const getDb = require("../database/database.js").getDb;

router.post("/", upload.none(), async (req, res) => {
  let dbo = getDb();
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

module.exports = router;
