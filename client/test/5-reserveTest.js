const request = require("supertest");
const chai = require("chai");
const expect = chai.expect;
const app = require("../server/app.js").app;
const start = require("../server/app.js").start;
const close = require("../server/app.js").close;

// Reserve ===================================================================

describe("POST-reserve", function () {
  beforeEach(async () => await start("Lib-copy"));
  afterEach(() => close());

  it("Reserve - user not found", async () => {
    const response = await request(app)
      .post("/reserve")
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

  it("Reserve - Can't reserve an available item!", async () => {
    const response = await request(app)
      .post("/reserve")
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
      msg: "Can't reserve an available item!",
    });
    expect(response.status).to.equal(200);
  });

  it("Reserve - You already borrowed this book!", async () => {
    const response = await request(app)
      .post("/reserve")
      .type("form")
      .field({ id: "5e55c5d0f7c9265492b50c88" })
      .set({ cookie: "sid=5e7a938caa89e53cf60ee3bb" });
    expect(response.header).to.include({
      "content-type": "text/html; charset=utf-8",
    });
    let body = await response.text;
    body = JSON.parse(body);
    expect(body).to.include({
      success: false,
      msg: "You already borrowed this book!",
    });
    expect(response.status).to.equal(200);
  });

  it("Reserve - Reserved successfully", async () => {
    const response = await request(app)
      .post("/reserve")
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
      msg: "Reserved successfully",
    });
    expect(body.book).to.deep.include({
      _id: "5e55c5d0f7c9265492b50c6f",
      title: "Collective Intelligence in Action",
      isbn: "1933988312",
      pageCount: 425,
      publishedDate: { date: "2008-10-01T00:00:00.000-0700" },
      thumbnailUrl:
        "https://s3.amazonaws.com/AKIAJC5RLADLUMVRPFDQ.book-thumb-images/alag.jpg",
      longDescription:
        "There's a great deal of wisdom in a crowd, but how do you listen to a thousand people talking at once  Identifying the wants, needs, and knowledge of internet users can be like listening to a mob.    In the Web 2.0 era, leveraging the collective power of user contributions, interactions, and feedback is the key to market dominance. A new category of powerful programming techniques lets you discover the patterns, inter-relationships, and individual profiles   the collective intelligence   locked in the data people leave behind as they surf websites, post blogs, and interact with other users.    Collective Intelligence in Action is a hands-on guidebook for implementing collective-intelligence concepts using Java. It is the first Java-based book to emphasize the underlying algorithms and technical implementation of vital data gathering and mining techniques like analyzing trends, discovering relationships, and making predictions. It provides a pragmatic approach to personalization by combining content-based analysis with collaborative approaches.    This book is for Java developers implementing collective intelligence in real, high-use applications. Following a running example in which you harvest and use information from blogs, you learn to develop software that you can embed in your own applications. The code examples are immediately reusable and give the Java developer a working collective intelligence toolkit.    Along the way, you work with, a number of APIs and open-source toolkits including text analysis and search using Lucene, web-crawling using Nutch, and applying machine learning algorithms using WEKA and the Java Data Mining (JDM) standard.",
      status: "PUBLISH",
      authors: ["Satnam Alag"],
      categories: ["Internet"],
      availability: false,
      borrower: "5e9093a459f4d54882e6b56b",
      reservations: ["5ed70fd14bb08b311bdcba85"],
      borrowedDate: 1585096470968,
    });
    expect(response.status).to.equal(200);
  });

  it("Reserve - You already reserved this book!", async () => {
    const response = await request(app)
      .post("/reserve")
      .type("form")
      .field({ id: "5e55c5d0f7c9265492b50c6f" })
      .set({ cookie: "sid=5e7a938caa89e53cf60ee3bb" });
    expect(response.header).to.include({
      "content-type": "text/html; charset=utf-8",
    });
    let body = await response.text;
    body = JSON.parse(body);
    expect(body).to.include({
      success: false,
      msg: "You already reserved this book!",
    });
    expect(response.status).to.equal(200);
  });
});
