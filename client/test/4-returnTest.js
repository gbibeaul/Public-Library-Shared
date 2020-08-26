const request = require("supertest");
const chai = require("chai");
const expect = chai.expect;
const app = require("../server/app.js").app;
const start = require("../server/app.js").start;
const close = require("../server/app.js").close;

// Return ===================================================================

describe("POST-return", function () {
  beforeEach(async () => await start("Lib-copy"));
  afterEach(() => close());

  it("Return - user not found", async () => {
    const response = await request(app)
      .post("/return")
      .type("form")
      .field({ id: "5e55c5d0f7c9265492b50c6b" })
      .set({ cookie: "sid=5e7a938cbb89e53cf60ee3bb" });
    expect(response.header).to.include({
      "content-type": "text/html; charset=utf-8",
    });
    let body = await response.text;
    body = JSON.parse(body);
    expect(body).to.include({ success: false, msg: "User is not active" });
    expect(response.status).to.equal(200);
  });

  it("Return - book not found", async () => {
    const response = await request(app)
      .post("/return")
      .type("form")
      .field({ id: "5e55c5d0f7c9265492b90c6b" })
      .set({ cookie: "sid=5e7a938caa89e53cf60ee3bb" });
    expect(response.header).to.include({
      "content-type": "text/html; charset=utf-8",
    });
    let body = await response.text;
    body = JSON.parse(body);
    expect(body).to.include({ success: false, msg: "Item not found" });
    expect(response.status).to.equal(200);
  });

  it("Return - returned successfully (no one is on waiting list)", async () => {
    const response = await request(app)
      .post("/return")
      .type("form")
      .field({ id: "5e55c5d0f7c9265492b50c6b" })
      .set({ cookie: "sid=5e7a938caa89e53cf60ee3bb" });
    expect(response.header).to.include({
      "content-type": "text/html; charset=utf-8",
    });
    let body = await response.text;
    body = JSON.parse(body);
    expect(body).to.include({ success: true, msg: "returned successfully" });
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
      availability: true,
      borrower: null,
      reservations: [],
      borrowedDate: null,
      returnDate: "",
    });
    expect(response.status).to.equal(200);
  });

  it("Return - returned successfully (someone is on waiting list)", async () => {
    const response = await request(app)
      .post("/return")
      .type("form")
      .field({ id: "5e55c5d0f7c9265492b50c71" })
      .set({ cookie: "sid=5e7a938caa89e53cf60ee3bb" });
    expect(response.header).to.include({
      "content-type": "text/html; charset=utf-8",
    });
    let body = await response.text;
    body = JSON.parse(body);
    expect(body).to.include({ success: true, msg: "returned successfully" });
    expect(body.book).to.deep.include({
      _id: "5e55c5d0f7c9265492b50c71",
      title: "Flex on Java",
      isbn: "1933988797",
      pageCount: 265,
      publishedDate: { date: "2010-10-15T00:00:00.000-0700" },
      thumbnailUrl:
        "https://s3.amazonaws.com/AKIAJC5RLADLUMVRPFDQ.book-thumb-images/allmon.jpg",
      shortDescription:
        "   A beautifully written book that is a must have for every Java Developer.       Ashish Kulkarni, Technical Director, E-Business Software Solutions Ltd.",
      longDescription:
        "In the demo, a hip designer, a sharply-dressed marketer, and a smiling, relaxed developer sip lattes and calmly discuss how Flex is going to make customers happy and shorten the workday   all while boosting the bottom line. The software systems they're using have been carefully selected and built from the ground up to work together seamlessly. There are no legacy systems, data, or competing business concerns to manage.    Cut to reality.    You're a Java developer. The marketing guy tells you that \"corporate\" wants a Flex-based site and you have to deliver it on top of what you already have. Your budget  Don't even ask. \"Make it look like the Discovery channel or something.\"    Flex on Java assumes you live in the real world   not the demo. This unique book shows you how to refactor an existing web application using the server-side you already know. You'll learn to use Flex 3 in concert with Spring, EJB 3, POJOs, JMS, and other standard technologies. Wherever possible, the examples use free or open source software.    The authors start with a typical Java web app and show you how to add a rich Flex interface. You also learn how to integrate Flex into your server-side Java via the BlazeDS framework, Adobe's open-source remoting and web messaging technology for Flex.    The book shows you how to deploy to not only the web but also to the desktop using the Adobe Integrated Runtime (AIR). You will learn how to integrate Flex into your existing applications in order to build a next generation application that will delight users.    Flex on Java is approachable for anyone beginning Java and Flex development.    ",
      status: "PUBLISH",
      authors: ["Bernerd Allmon", "Jeremy Anderson"],
      categories: ["Internet"],
      availability: false,
      borrower: "5e8ffad7504197476597c5e7",
      reservations: ["5e9093a459f4d54882e6b56b"],
    });
    expect(response.status).to.equal(200);
  });
});
