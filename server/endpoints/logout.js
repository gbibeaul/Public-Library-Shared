const express = require("express");
const router = express.Router();
const getDb = require("../database/database.js").getDb;

router.get("/", async (req, res) => {
  let dbo = getDb();
  const sessionId = req.cookies.sid;
  const user = await dbo.collection("sessions").findOne({ sid: sessionId });
  const email = user.email;
  if (!email)
    return res.send(
      JSON.stringify({ success: false, msg: "You need to Login First!" })
    );
  await dbo.collection("sessions").deleteOne({ sid: sessionId, email: email });
  res.send(
    JSON.stringify({ success: true, msg: "You Have Logged Out Successfully" })
  );
});

module.exports = router;
