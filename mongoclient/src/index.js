const { MongoClient } = require("mongodb");

const uri = "mongodb://127.0.0.1:27017";
const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    const db = client.db("assignment8");

    console.log("Connected to MongoDB from MongoClient");

    const insertResult = await db.collection("books").insertOne({
      title: "MongoClient Book",
      author: "Student",
      year: 2024,
      genres: ["Programming", "Education"]
    });

    console.log("Inserted ID:", insertResult.insertedId);

    const books = await db.collection("books").find().toArray();
    console.log("Books:", books);

    const oneBook = await db.collection("books").findOne({
      title: "MongoClient Book"
    });

    console.log("One Book:", oneBook);

  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

run();