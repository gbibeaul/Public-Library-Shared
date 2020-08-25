require("dotenv").config({ path: "./.env" });
const request = require("supertest");
const chai = require("chai");
const expect = chai.expect;
const app = require("../server/app.js").app;
const start = require("../server/app.js").start;
const close = require("../server/app.js").close;

// One Item ===================================================================

describe("GET /item", function () {
  beforeEach(async () => await start("Lib-copy"));
  afterEach(() => close());

  it("it should return one item", async () => {
    const response = await request(app)
      .get("/item")
      .query({ id: "5e55c5d0f7c9265492b50c6b" })
      .set("Accept", "application/json");
    expect(response.header).to.include({
      "content-type": "text/html; charset=utf-8",
    });
    let body = await response.text;
    body = JSON.parse(body);
    expect(body.success).to.equal(true);
    expect(body.item)
      .to.be.an("object")
      .to.deep.include({
        _id: "5e55c5d0f7c9265492b50c6b",
        title: "Android in Action, Second Edition",
        isbn: "1935182722",
        pageCount: 592,
        publishedDate: { date: "2011-01-14T00:00:00.000-0800" },
        thumbnailUrl:
          "https://s3.amazonaws.com/AKIAJC5RLADLUMVRPFDQ.book-thumb-images/ableson2.jpg",
        shortDescription:
          "Android in Action, Second Edition is a comprehensive tutorial for Android developers. Taking you far beyond \"Hello Android,\" this fast-paced book puts you in the driver's seat as you learn important architectural concepts and implementation strategies. You'll master the SDK, build WebKit apps using HTML 5, and even learn to extend or replace Android's built-in features by building useful and intriguing examples. ",
        longDescription:
          "When it comes to mobile apps, Android can do almost anything   and with this book, so can you! Android runs on mobile devices ranging from smart phones to tablets to countless special-purpose gadgets. It's the broadest mobile platform available.    Android in Action, Second Edition is a comprehensive tutorial for Android developers. Taking you far beyond \"Hello Android,\" this fast-paced book puts you in the driver's seat as you learn important architectural concepts and implementation strategies. You'll master the SDK, build WebKit apps using HTML 5, and even learn to extend or replace Android's built-in features by building useful and intriguing examples. ",
        status: "PUBLISH",
        authors: ["W. Frank Ableson", "Robi Sen"],
        categories: ["Java"],
        availability: true,
        borrower: "",
        reservations: [],
        borrowedDate: "",
        returnDate: "",
        borrowedDays: [],
      });
    expect(response.status).to.equal(200);
  });
});

// All Items ===================================================================

describe("GET /items", function () {
  beforeEach(async () => await start("Lib-copy"));
  afterEach(() => close());

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
    expect(body.items.length).to.equal(6);
    expect(response.status).to.equal(200);
  });
});
