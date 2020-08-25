const express = require("express");
const router = express.Router();
const getDb = require("../database/database.js").getDb;

router.get("/", async (req, res) => {
  let sessionId = req.cookies.sid;
  try {
    const user = await getDb("sessions").findOne({ sid: sessionId });
    user
      ? res.send(
          JSON.stringify({
            success: true,
            email: user.email,
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
module.exports = router;
