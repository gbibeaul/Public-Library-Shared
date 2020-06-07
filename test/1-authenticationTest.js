const request = require("supertest");
const chai = require("chai");
const expect = chai.expect;
const path = require("path");
const mySeeder = require("../server/database/testDb.js");
const app = require("../server/app.js").app;
const start = require("../server/app.js").start;
const close = require("../server/app.js").close;

before(async () => await mySeeder());

// Login
describe("LOGIN", function () {
  beforeEach(async () => await start("Lib-copy"));
  afterEach(() => close());

  it("Login - user not found", async () => {
    const response = await request(app)
      .post("/login")
      .type("form")
      .field(
        "user",
        JSON.stringify({
          email: "ashkan@yahoo.com",
          password: "10217021218032710",
        })
      );

    expect(response.header).to.include({
      "content-type": "text/html; charset=utf-8",
    });
    let body = await response.text;
    body = JSON.parse(body);
    expect(body).to.include({
      success: false,
      msg: "Login-Error, Username not found!",
    });
    expect(response.status).to.equal(200);
  });
  it("Login - wrong password", async () => {
    const response = await request(app)
      .post("/login")
      .type("form")
      .field(
        "user",
        JSON.stringify({
          email: "ashkan.zarqam@yahoo.com",
          password: "10217021218032711",
        })
      );

    expect(response.header).to.include({
      "content-type": "text/html; charset=utf-8",
    });
    let body = await response.text;
    body = JSON.parse(body);
    expect(body).to.include({
      success: false,
      msg: "Login-Error, Incorrect Password!",
    });
    expect(response.status).to.equal(200);
  });
  it("Login - successfull", async () => {
    const response = await request(app)
      .post("/login")
      .type("form")
      .field(
        "user",
        JSON.stringify({
          email: "ashkan.zarqam@yahoo.com",
          password: "10217021218032710",
        })
      );

    expect(response.header).to.include({
      "content-type": "text/html; charset=utf-8",
    });
    let body = await response.text;
    body = JSON.parse(body);
    expect(body).to.include({
      success: true,
      msg: "Login Successful!",
      email: "ashkan.zarqam@yahoo.com",
      name: "Ashkan Irani",
      id: "5ed70fd14bb08b311bdcba85",
    });
    expect(response.status).to.equal(200);
  });
});
