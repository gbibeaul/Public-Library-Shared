const request = require("supertest");
const chai = require("chai");
const expect = chai.expect;
const app = require("../server/app.js").app;
const start = require("../server/app.js").start;
const close = require("../server/app.js").close;

// Borrow ===================================================================

describe("POST-borrow", function () {
  beforeEach(async () => await start("Lib-copy"));
  afterEach(() => close());

  it("Borrow - User is not active", async () => {
    const response = await request(app)
      .post("/borrow")
      .type("form")
      .field({ id: "5e55c5d0f7c9265492b50c6b" });
    expect(response.header).to.include({
      "content-type": "text/html; charset=utf-8",
    });
    let body = await response.text;
    body = JSON.parse(body);
    expect(body).to.include({ success: false, msg: "User is not active" });
    expect(response.status).to.equal(200);
  });

  it("Borrow - Book not found", async () => {
    const response = await request(app)
      .post("/borrow")
      .type("form")
      .field({ id: "5e55c5d0f7c1000492b50c6b" })
      .set("cookie", "sid=5e7a938caa89e53cf60ee3bb");
    expect(response.header).to.include({
      "content-type": "text/html; charset=utf-8",
    });
    let body = await response.text;
    body = JSON.parse(body);
    expect(body).to.deep.include({ success: false, msg: "Item not found" });
    expect(response.status).to.equal(200);
  });

  it("Borrow - You have already borrowed", async () => {
    const response = await request(app)
      .post("/borrow")
      .type("form")
      .field({ id: "5e55c5d0f7c9265492b50c72" })
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

  it("Borrow - book is not available", async () => {
    const response = await request(app)
      .post("/borrow")
      .type("form")
      .field({ id: "5e55c5d0f7c9265492b50c70" })
      .set("cookie", "sid=5e7a938caa89e53cf60ee3bb");
    expect(response.header).to.include({
      "content-type": "text/html; charset=utf-8",
    });
    let body = await response.text;
    body = JSON.parse(body);
    expect(body).to.include({
      success: false,
      msg: "Item is not available",
    });
    expect(response.status).to.equal(200);
  });
  it("Borrow - borrowed successfully", async () => {
    const response = await request(app)
      .post("/borrow")
      .type("form")
      .field({ id: "5e55c5d0f7c9265492b50c6b" })
      .set("cookie", "sid=5e7a938caa89e53cf60ee3bb");
    expect(response.header).to.include({
      "content-type": "text/html; charset=utf-8",
    });
    let body = await response.text;
    body = JSON.parse(body);
    expect(body).to.include({
      success: true,
      msg: "borrowed successfully",
    });
    expect(body.book).to.deep.include({
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
      availability: false,
      borrower: "5ed70fd14bb08b311bdcba85",
      reservations: [],
      returnDate: "",
      borrowedDays: [],
    });
    expect(response.status).to.equal(200);
  });
});
