const request = require("supertest");
const chai = require("chai");
const expect = chai.expect;
const app = require("../server/app.js").app;
const start = require("../server/app.js").start;
const close = require("../server/app.js").close;

// Cancel Reserve ===================================================================

describe("POST-reserve", function () {
  beforeEach(async () => await start("Lib-copy"));
  afterEach(() => close());

  it("Cancel Reserve - user not found", async () => {
    const response = await request(app)
      .post("/cancelReserve")
      .type("form")
      .field({ id: "5e55c5d0f7c9265492b50c6f" })
      .set({ cookie: "sid=5e7a938caa89e53cf60de3bb" });
    expect(response.header).to.include({
      "content-type": "text/html; charset=utf-8",
    });
    let body = await response.text;
    body = JSON.parse(body);
    expect(body).to.include({ success: false, msg: "User is not active" });
    expect(response.status).to.equal(200);
  });

  it("Cancel Reserve - Item is not in your reservation to unreserve!", async () => {
    const response = await request(app)
      .post("/cancelReserve")
      .type("form")
      .field({ id: "5e55c5d0f7c9265492b50c6b" })
      .set({ cookie: "sid=5e7a938caa89e53cf60ee3bb" });
    expect(response.header).to.include({
      "content-type": "text/html; charset=utf-8",
    });
    let body = await response.text;
    body = JSON.parse(body);
    expect(body).to.include({
      success: false,
      msg: "Item is not in your reservation to unreserve!",
    });
    expect(response.status).to.equal(200);
  });

  it("Cancel Reserve - Un-Reserved Successfully", async () => {
    const response = await request(app)
      .post("/cancelReserve")
      .type("form")
      .field({ id: "5e55c5d0f7c9265492b50c6f" })
      .set({ cookie: "sid=5e7a938caa89e53cf60ee3bb" });
    expect(response.header).to.include({
      "content-type": "text/html; charset=utf-8",
    });
    let body = await response.text;
    body = JSON.parse(body);
    expect(body).to.include({
      success: true,
      msg: "Un-Reserved Successfully",
    });
    expect(response.status).to.equal(200);
  });
});
// LOGOUT ===================================================================
// NEEDS TO BE AT THE END OF THE TEST!!

describe("LOGOUT", function () {
  beforeEach(async () => await start("Lib-copy"));
  afterEach(() => close());

  it("Logout - successfull", async () => {
    const response = await request(app)
      .get("/logout")
      .set({ cookie: "sid=5e7a938caa89e53cf60ee3bb" })
      .set("Accept", "application/json");
    expect(response.header).to.include({
      "content-type": "text/html; charset=utf-8",
    });
    expect(response.header).to.include({
      "content-type": "text/html; charset=utf-8",
    });
    let body = await response.text;
    body = JSON.parse(body);
    expect(body).to.deep.equal({
      msg: "You Have Logged Out Successfully",
      success: true,
    });
    expect(response.status).to.equal(200);
  });
});
