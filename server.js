"use strict";

const express = require("express");
const cors = require("cors");
require("dotenv").config();
const mongoose = require("mongoose");

const server = express();
server.use(cors());
server.use(express.json());

const PORT = process.env.PORT;

mongoose.connect("mongodb://localhost:27017/books", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const bookSchema = new mongoose.Schema({
  title: String,
  description: String,
});

const ownerSchema = new mongoose.Schema({
  ownerEmail: String,
  books: [bookSchema],
});

const bookModel = mongoose.model("book", bookSchema);
const ownerModel = mongoose.model("owner", ownerSchema);

function seedBookCollection() {
  const mindset = new bookModel({
    title: "minset",
    description:
      "In this brilliant book, she shows how success in school,work, sports, the arts, and almost every area of human endeavor can be dramatically influenced by how we think about our talents and abilities. People with a fixed mindset — those who believe that abilities are fixed — are less likely to flourish than those with a growth mindset — those who believe that abilities can be developed. Mindset reveals how great parents, teachers, managers, and athletes can put this idea to use to foster outstanding accomplishment. ",
  });
  const veronikaDecidesToDie = new bookModel({
    title: "veronika Decides To Die",
    description:
      "Veronika, an attractive 24-year-old woman living in Ljubljana, Slovenia, has loving parents, an okay job, decent boyfriends, and so on. However she s tired of her routine life and tries to commit suicide. Veronikas attempt fails and she wakes up in Villete, a local mental hospital. ",
  });

  mindset.save();
  veronikaDecidesToDie.save();
}
seedBookCollection();

function seedOwnerCollection() {
  const ghadeer = new ownerModel({
    ownerEmail: "ghadeerkhasawneh91@gmail.com",
    books: [
      {
        title: "minset",
        description:
          "In this brilliant book, she shows how success in school,work, sports, the arts, and almost every area of human endeavor can be dramatically influenced by how we think about our talents and abilities. People with a fixed mindset — those who believe that abilities are fixed — are less likely to flourish than those with a growth mindset — those who believe that abilities can be developed. Mindset reveals how great parents, teachers, managers, and athletes can put this idea to use to foster outstanding accomplishment. ",
      },
      {
        title: "veronika Decides To Die",
        description:
          "Veronika, an attractive 24-year-old woman living in Ljubljana, Slovenia, has loving parents, an okay job, decent boyfriends, and so on. However she s tired of her routine life and tries to commit suicide. Veronikas attempt fails and she wakes up in Villete, a local mental hospital. ",
      },
    ],
  });

  const ghaida = new ownerModel({
    ownerEmail: "ghidaghraibeh12@gmail.com",
    books: [
      {
        title: "veronika Decides To Die",
        description:
          "Veronika, an attractive 24-year-old woman living in Ljubljana, Slovenia, has loving parents, an okay job, decent boyfriends, and so on. However she s tired of her routine life and tries to commit suicide. Veronikas attempt fails and she wakes up in Villete, a local mental hospital. ",
      },
      {
        title: "mindset",
        description:
          "In this brilliant book, she shows how success in school,work, sports, the arts, and almost every area of human endeavor can be dramatically influenced by how we think about our talents and abilities. People with a fixed mindset — those who believe that abilities are fixed — are less likely to flourish than those with a growth mindset — those who believe that abilities can be developed. Mindset reveals how great parents, teachers, managers, and athletes can put this idea to use to foster outstanding accomplishment. ",
      },
    ],
  });

  ghadeer.save();
  ghaida.save();
}

seedOwnerCollection();

server.get("/books", getBooksHandler);
// server.post("/addbooks", addBooksFun);

//http://localhost:3001/books?email=ghadeerkhasawneh91@gmail.com

function getBooksHandler(req, res) {
  let { email } = req.query;
  // let {name} = req.query
  ownerModel.find({ ownerEmail: email }, function (err, ownerData) {
    if (err) {
      console.log("is not working");
    } else {
      console.log(ownerData);
      // console.log(ownerData[0])
      // console.log(ownerData[0].books)
      res.send(ownerData[0].books);
    }
  });

  server.listen(PORT, () => {
    console.log(`Listening on PORT ${PORT}`);
  });
}

server.post("/addBook", addBooksHandler);

function addBooksHandler(req, res) {
  const { title, description, ownerEmail } = req.body;
  console.log(bookName);

  ownerModel.find({ ownerEmail: ownerEmail }, (error, ownerData) => {
    if (error) {
      res.send("is not working");
    } else {
      ownerData[0].books.push({
        title: title,
        description: description,
      });
      ownerData[0].save();
      res.send(ownerData[0].books);
    }
  });
}
