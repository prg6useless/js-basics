//combine everything
// http;
// dotenv;
// qrcode;
// pdf;
// nodemailer;

// url input : saralsainju07@gmail.com -> qrcode ->
// save as image -> save this image to pdf -> send pdf as email to saralsainju07@gmail.com

const http = require("http");
const event = require("events");
const myEvent = new event.EventEmitter();
require("dotenv").config();
const gen_QR = require("./modules/qrcodeGenerator");
const gen_PDF = require("./modules/pdfCreator");
const mail = require("./modules/mailSender");

http
  .createServer(async (req, res) => {
    const data = req.url.split("=")[1];
    if (data !== undefined) {
      await gen_QR.generateQRcode(data);
      await gen_PDF.createPDF("./site.png");
      // listen
      const attachments = [
        {
          // define custom content type for the attachment
          filename: "qrcode.pdf",
          path: "./qrcode.pdf",
        },
      ];
      // fire
      myEvent.on("sendMail", (attachments) => {
        mailSender(attachments);
        console.log("Message Sent");
      });
      myEvent.emit("sendMail", attachments);
      res.writeHead(200, { "Content-Type": "text/html" });
      const msg = `<h3>Message sent to ${data}`;
      res.end(msg);
    } else {
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end("hello");
    }
  })
  .listen(7777);

const mailSender = ( attachments ) => {
  mail.sendMail({
    username: process.env.APP_USERNAME,
    password: process.env.APP_PASSWORD,
    attachments,
  });
};
