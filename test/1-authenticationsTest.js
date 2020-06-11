const request = require("supertest");
const chai = require("chai");
const expect = chai.expect;
const path = require("path");
const mySeeder = require("../server/database/testDb.js");
const app = require("../server/app.js").app;
const start = require("../server/app.js").start;
const close = require("../server/app.js").close;

before(async () => await mySeeder());

// Login ===================================================================
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
    console.log("body", body);
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

// SIGNUP ===================================================================
describe("SUGNUP", function () {
  beforeEach(async () => await start("Lib-copy"));
  afterEach(() => close());

  it("signup - signed up successfully", async () => {
    const response = await request(app)
      .post("/signup")
      .type("form")
      .field(
        "user",
        JSON.stringify({
          name: "Donald Trump",
          email: "D@T.com",
          password: "12345",
          confirmPassword: "12345",
          image: "",
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
    });
    expect(body).to.deep.include({
      name: "Donald Trump",
      email: "D@T.com",
    });
    expect(response.status).to.equal(200);
  });

  it("signup - username already taken", async () => {
    const response = await request(app)
      .post("/signup")
      .type("form")
      .field(
        "user",
        JSON.stringify({
          email: "ashkan.zarqam@yahoo.com",
          name: "Ashkan Irani",
          password: "12345",
          confirmPassword: "12345",
          image: "",
        })
      );

    expect(response.header).to.include({
      "content-type": "text/html; charset=utf-8",
    });
    let body = await response.text;
    body = JSON.parse(body);
    expect(body).to.include({
      success: false,
      msg: "Username is already taken!",
    });
    expect(response.status).to.equal(200);
  });
});

// Sessions ===================================================================

describe("SESSIONS", function () {
  beforeEach(async () => await start("Lib-copy"));
  afterEach(() => close());

  it("Is Active", async function () {
    const response = await request(app)
      .get("/sessions")
      .set({ cookie: "sid=5e7a938caa89e53cf60ee3bb" })
      .set("Accept", "application/json");
    expect(response.header).to.include({
      "content-type": "text/html; charset=utf-8",
    });
    let body = await response.text;
    body = JSON.parse(body);
    expect(body).to.deep.equal({
      success: true,
      email: "ashkan.zarqam@yahoo.com",
      name: "Ashkan Irani",
      id: "5ed70fd14bb08b311bdcba85",
      msg: "User is active",
    });

    expect(response.status).to.equal(200);
  });
  it("Is not Active", async function () {
    const response = await request(app)
      .get("/sessions")
      .set({ cookie: "sid=5e7a938caa89e57765ee3bb" })
      .set("Accept", "application/json");
    expect(response.header).to.include({
      "content-type": "text/html; charset=utf-8",
    });
    let body = await response.text;
    body = JSON.parse(body);
    console.log("body", body);
    expect(body).to.deep.equal({
      success: false,
      msg: "User is not active",
    });
    expect(response.status).to.equal(200);
  });
});
