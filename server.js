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
  status: String,
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
    status: "Available",
  });
  const veronikaDecidesToDie = new bookModel({
    title: "veronika Decides To Die",
    description:
      "Veronika, an attractive 24-year-old woman living in Ljubljana, Slovenia, has loving parents, an okay job, decent boyfriends, and so on. However she s tired of her routine life and tries to commit suicide. Veronikas attempt fails and she wakes up in Villete, a local mental hospital. ",
    status: "Available",
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
        status: "Available",
      },
      {
        title: "veronika Decides To Die",
        description:
          "Veronika, an attractive 24-year-old woman living in Ljubljana, Slovenia, has loving parents, an okay job, decent boyfriends, and so on. However she s tired of her routine life and tries to commit suicide. Veronikas attempt fails and she wakes up in Villete, a local mental hospital. ",
        status: "Available",
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
        status: "Available",
      },
      {
        title: "mindset",
        description:
          "In this brilliant book, she shows how success in school,work, sports, the arts, and almost every area of human endeavor can be dramatically influenced by how we think about our talents and abilities. People with a fixed mindset — those who believe that abilities are fixed — are less likely to flourish than those with a growth mindset — those who believe that abilities can be developed. Mindset reveals how great parents, teachers, managers, and athletes can put this idea to use to foster outstanding accomplishment. ",
        status: "Available",
      },
    ],
  });

  ghadeer.save();
  ghaida.save();
}

seedOwnerCollection();

server.get("/books", getBooksHandler);
// server.post("/addbooks", addBooksFun);

//http://localhost:3025/books?email=ghadeerkhasawneh91@gmail.com

function getBooksHandler(req, res) {
  let { email } = req.query;
  // let {name} = req.query
  ownerModel.find({ ownerEmail: email }, function (err, ownerData) {
    if (err || ownerData.length == 0) {
      console.log("is not working");
    } else {
      // console.log(ownerData[0]);
      console.log(ownerData[0].books);
      res.send(ownerData[0].books);
    }
  });
}

server.post("/addBook", addBooksHandler);

function addBooksHandler(req, res) {
  const { email, title, description, status } = req.body;

  console.log(title, description, email);

  ownerModel.find({ ownerEmail: email }, (error, ownerData) => {
    if (error || ownerData.length == 0) {
      res.send("is not working");
    } else {
      console.log(ownerData[0], "Ammar");
      ownerData[0].books.push({
        title: title,
        description: description,
        status: status,
      });
      ownerData[0].save();
      res.send(ownerData[0].books);
    }
  });
}

server.delete("/books/:index", deleteBooksHandler);

function deleteBooksHandler(req, res) {
  const { email } = req.query;
  const index = req.params.index;

  ownerModel.find({ ownerEmail: email }, (error, ownerData) => {
    if (error || ownerData.length == 0) {
      console.log(`The error is ${error}`);
      res.status(404).send("Kill me");
    } else {
      const newData = ownerData[0].books.filter((item, idx) => {
        if (idx != index) {
          return item;
        }
      });
      console.log(newData);
      ownerData[0].books = newData;
      ownerData[0].save();
      res.status(200).send(ownerData[0].books);
    }
  });
}

server.put("/updateBook", updateBooksHandler);

function updateBooksHandler(req, res) {
  const index = req.params.index;
  const { title, description, status, email } = req.body;
  ownerModel.findOne({ ownerEmail: email }, (err, resultData) => {
    // console.log('findOne: ' ,resultData);
    resultData.books.splice(index, 1, {
      title: title,
      description: description,
      status: status,
      email: email,
    });
    resultData.save();
    res.send(resultData[0].books);
  });
}

server.listen(PORT, () => {
  console.log(`Listening on PORT ${PORT}`);
});
