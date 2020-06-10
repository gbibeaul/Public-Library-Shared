const express = require("express");
const router = express.Router();
const getDb = require("../database/database.js").getDb;

router.get("/", async (req, res) => {
  const sessionId = req.cookies.sid;
  console.log("sessionId", sessionId);
  const user = await getDb("sessions").findOne({ sid: sessionId });
  console.log("user", user);
  const email = user.email;
  if (!email)
    return res.send(
      JSON.stringify({ success: false, msg: "You need to Login First!" })
    );
  await getDb("sessions").deleteOne({ sid: sessionId, email: email });
  res.send(
    JSON.stringify({ success: true, msg: "You Have Logged Out Successfully" })
  );
});

module.exports = router;
