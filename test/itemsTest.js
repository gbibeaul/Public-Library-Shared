require("dotenv").config({ path: "./.env" });
const request = require("supertest");
const chai = require("chai");
const expect = chai.expect;
const app = require("../server/app.js").app;
const start = require("../server/app.js").start;
const close = require("../server/app.js").close;

// One Item

describe("GET /item", function () {
  it("it should return one item", async () => {
    const response = await request(app)
      .get("/item")
      .query({ id: "5e55c5d0f7c9265492b50cd9" })
      .set("Accept", "application/json");
    expect(response.header).to.include({
      "content-type": "text/html; charset=utf-8",
    });
    let body = await response.text;
    body = JSON.parse(body);
    expect(body.success).to.equal(true);
    expect(body.item).to.be.an("object").that.does.include({
      isbn: "1617290211",
      _id: "5e55c5d0f7c9265492b50cd9",
    });
    expect(response.status).to.equal(200);
  });
});

// All Items
describe("GET /items", function () {
  it("it should return all items", async () => {
    const response = await request(app)
      .get("/items")
      .set("Accept", "application/json");
    expect(response.header).to.include({
      "content-type": "text/html; charset=utf-8",
    });
    let body = await response.text;
    body = JSON.parse(body);
    expect(body).to.be.an("object").that.does.include({ success: true });
    expect(body.items.length).to.be.at.least(200);
    expect(response.status).to.equal(200);
  });
});
