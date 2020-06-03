require("dotenv").config({ path: "./.env" });
const request = require("supertest");
const chai = require("chai");
const expect = chai.expect;
const app = require("../server/app.js").app;
const start = require("../server/app.js").start;
const close = require("../server/app.js").close;

// Borrow

describe("POST-borrow", function () {
  before(() => start());
  after(() => close);
  it("it should return an error - User is not active", async () => {
    const response = await request(app)
      .post("/borrow")
      .type("form")
      .field({ id: "5e55c5d0f7c9265492b50dc5" });
    expect(response.header).to.include({
      "content-type": "text/html; charset=utf-8",
    });

    let body = await response.text;
    body = JSON.parse(body);
    expect(body).to.include({ success: false, msg: "User is not active" });
    expect(response.status).to.equal(200);
  });
  it("it should return an error - You have already borrowed", async () => {
    const response = await request(app)
      .post("/borrow")
      .type("form")
      .field({ id: "5e55c5d0f7c9265492b50dc5" })
      .set("cookie", "sid=5e7a938caa89e53cf60ee3bb");
    expect(response.header).to.include({
      "content-type": "text/html; charset=utf-8",
    });
    let body = await response.text;
    body = JSON.parse(body);
    expect(body).to.include({
      success: false,
      msg: "You have already borrowed this item!",
    });
    expect(response.status).to.equal(200);
  });
  it("it should return success", async () => {
    const response = await request(app)
      .post("/borrow")
      .type("form")
      .field({ id: "5e55c5d0f7c9265492b50dc5" })
      .set("cookie", "sid=5e7a938caa89e53cf60ee3bb");
    expect(response.header).to.include({
      "content-type": "text/html; charset=utf-8",
    });
    let body = await response.text;
    body = JSON.parse(body);
    console.log("body", body.msg);
    expect(body).to.include({ success: true, msg: "borrowed successfully" });
    expect(body.book).to.be.an("object");
    expect(response.status).to.equal(200);
  });
});
