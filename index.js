require("dotenv").config();

const express = require("express");
const mongodb = require("mongodb");
const app = express();
const port = process.env.port || 3000;

// Connection URL
const url = process.env.DB_URL;

const MongoClient = mongodb.MongoClient;
const objectId = mongodb.ObjectId;

// Database Name
const dbName = "test";
app.use(express.json());

app.get("/", async (req, res) => {
  try {
    let client = await MongoClient.connect(url);
    console.log("Connected successfully to server");
    const db = client.db(dbName);
    const data = await db.collection("user").find().toArray();
    if (data) {
      res.status(200).json(data);
    } else res.status(404).json({ msg: "no data" });
    client.close();
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "internal sever error" });
  }
});

app.post("/create", async (req, res) => {
  try {
    let client = await MongoClient.connect(url);
    console.log("Connected successfully to server");
    const db = client.db("test");
    await db.collection("admin").insertOne(req.body);
    res.status(200).json({ msg: "created" });
    client.close();
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "internal sever error" });
  }
});

//Update
app.put("/update/:id", async (req, res) => {
  try {
    let client = await MongoClient.connect(url);
    console.log("Connected successfully to server");
    const db = client.db("test");
    await db
      .collection("user")
      .findOneAndUpdate({ _id: objectId(req.params.id) }, { $set: req.body });
    res.status(200).json({ msg: "updated" });
    client.close();
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "internal sever error" });
  }
});

app.delete("/delete/:id", async (req, res) => {
  try {
    let client = await MongoClient.connect(url);
    console.log("Connected successfully to server");
    const db = client.db("test");
    await db
      .collection("user")
      .findOneAndDelete({ _id: objectId(req.params.id) });
    res.status(200).json({ msg: "deleted" });
    client.close();
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "internal sever error" });
  }
});

app.listen(port, () => console.log(`app running on port ${port}`));
