"use strict";

const express = require("express");
const cors = require("cors");
require("dotenv").config();
const mongoose = require("mongoose");

const server = express();
server.use(cors());

const PORT = process.env.PORT;

mongoose.connect("mongodb://localhost:27017/books", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const bookSchema = new mongoose.Schema({
  title: String,
  description: String,
  status: Boolean,
  ownerEmail: String,
});

const bookModel = mongoose.model("book", bookSchema);

function seedingBooks() {
  const mindset = new bookModel({
    ownerEmail: "ghidaghraibeh12@gmail.com",
    title: "mindset",
    description:
      "In this brilliant book, she shows how success in school,work, sports, the arts, and almost every area of human endeavor can be dramatically influenced by how we think about our talents and abilities. People with a fixed mindset — those who believe that abilities are fixed — are less likely to flourish than those with a growth mindset — those who believe that abilities can be developed. Mindset reveals how great parents, teachers, managers, and athletes can put this idea to use to foster outstanding accomplishment. ",
    status: true,
  });
  const veronikaDecidesToDie = new bookModel({
    ownerEmail: "ghidaghraibeh12@gmail.com",
    title: "Veronika decides  to die",
    description:
      "Veronika, an attractive 24-year-old woman living in Ljubljana, Slovenia, has loving parents, an okay job, decent boyfriends, and so on. However she s tired of her routine life and tries to commit suicide. Veronikas attempt fails and she wakes up in Villete, a local mental hospital. ",
    status: true,
  });
  const thePowerOfNow = new bookModel({
    ownerEmail: "ghidaghraibeh12@gmail.com",
    title: "The power of now",
    description:
      'living in the now is the truest path to happiness and enlightenment. And while this message may not seem stunningly original or fresh, Tolles clear writing, supportive voice and enthusiasm make this an excellent manual for anyone whos ever wondered what exactly "living in the now" means. Foremost, Tolle is a world-class teacher, able to explain complicated concepts in concrete language. More importantly, within a chapter of reading this book, readers are already holding the world in a different container--more conscious of how thoughts and emotions get in the way of their ability to live in genuine peace and happiness ',
    status: true,
  });

  mindset.save();
  veronikaDecidesToDie.save();
  thePowerOfNow.save();
}
seedingBooks();


server.get("/books", getBooksFun);

function getBooksFun(req, res) {
  const reqEmail = req.query.email;

  bookModel.find({ ownerEmail: reqEmail }, function (err, outputs) {
    if (err) {
      console.log("Error");
    } else {
      // console.log(outputs);
      // console.log(outputs);
      res.send(outputs);
    }
  });
}


// //http:localhost:3033/book?book=

// server.get('/books',addBookFun);

// function addBookFun (req,res){
//   res.send('test');
//   console.log(res.send('test'))
// }


server.listen(PORT, () => {
  console.log(`Listening on PORT ${PORT}`);
});
