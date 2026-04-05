const express = require("express");
const { MongoClient } = require("mongodb");

const app = express();
app.use(express.json());

const uri = "mongodb://127.0.0.1:27017";
const client = new MongoClient(uri);

let db;

async function startServer() {
  try {
    await client.connect();
    db = client.db("assignment8");
    console.log("Connected to MongoDB");

    app.listen(3000, () => {
      console.log("Server running on http://localhost:3000");
    });
  } catch (err) {
    console.error(err);
  }
}

startServer();


app.post("/collection/books", async (req, res) => {
  try {
    const result = await db.createCollection("books", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["title"],
          properties: {
            title: {
              bsonType: "string",
              minLength: 1
            }
          }
        }
      }
    });

    res.json({
      message: "books collection created",
      collection: result.collectionName
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// سؤال 2
app.post("/collection/authors", async (req, res) => {
  try {
    const result = await db.collection("authors").insertOne({
      name: "author1",
      nationality: "British"
    });

    res.json({
      acknowledged: result.acknowledged,
      insertedId: result.insertedId
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.post("/collection/logs/capped", async (req, res) => {
  try {
    const result = await db.createCollection("logs", {
      capped: true,
      size: 1024 * 1024 // 1MB
    });

    res.json({
      message: "logs capped collection created",
      collection: result.collectionName
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.post("/collection/books/index", async (req, res) => {
  try {
    const result = await db.collection("books").createIndex({
      title: 1
    });

    res.json({
      message: "index created on title",
      index: result
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.post("/books", async (req, res) => {
  try {
    const result = await db.collection("books").insertOne({
      title: "Book1",
      author: "Ali",
      year: 1997,
      genres: ["Fantasy", "Adventure"]
    });

    res.json({
      acknowledged: result.acknowledged,
      insertedId: result.insertedId
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.post("/books/batch", async (req, res) => {
  try {
    const result = await db.collection("books").insertMany([
      {
        title: "Future",
        author: "George Orwell",
        year: 2020,
        genres: ["Science Fiction"]
      },
      {
        title: "Kill a Mockingbird",
        author: "Harper Lee",
        year: 1960,
        genres: ["Classic", "Fiction"]
      },
      {
        title: "Brave New World",
        author: "Aldous Huxley",
        year: 1932,
        genres: ["Dystopian", "Science Fiction"]
      }
    ]);

    res.json({
      acknowledged: result.acknowledged,
      insertedIds: result.insertedIds
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.post("/logs", async (req, res) => {
  try {
    const result = await db.collection("logs").insertOne({
      book_id: "some_book_id",
      action: "borrowed",
      date: new Date()
    });

    res.json({
      acknowledged: result.acknowledged,
      insertedId: result.insertedId
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.get("/books", async (req, res) => {
  try {
    const books = await db.collection("books").find().toArray();

    res.json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.get("/books/title", async (req, res) => {
  try {
    const title = req.query.title;

    const book = await db.collection("books").findOne({
      title: title
    });

    res.json(book);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.get("/books/year", async (req, res) => {
  try {
    const from = parseInt(req.query.from);
    const to = parseInt(req.query.to);

    const books = await db.collection("books").find({
      year: { $gte: from, $lte: to }
    }).toArray();

    res.json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.get("/books/genre", async (req, res) => {
  try {
    const genre = req.query.genre;

    const books = await db.collection("books").find({
      genres: genre
    }).toArray();

    res.json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.get("/books/skip-limit", async (req, res) => {
  try {
    const books = await db.collection("books")
      .find()
      .sort({ year: -1 }) 
      .skip(2)
      .limit(3)
      .toArray();

    res.json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.get("/books/exclude-genres", async (req, res) => {
  try {
    const books = await db.collection("books").find({
      genres: { $nin: ["Horror", "Science Fiction"] }
    }).toArray();

    res.json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.delete("/books/before-year", async (req, res) => {
  try {
    const year = parseInt(req.query.year);

    const result = await db.collection("books").deleteMany({
      year: { $lt: year }
    });

    res.json({
      acknowledged: result.acknowledged,
      deletedCount: result.deletedCount
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.get("/books/aggregate1", async (req, res) => {
  try {
    const books = await db.collection("books").aggregate([
      { $match: { year: { $gt: 2000 } } },
      { $sort: { year: -1 } }
    ]).toArray();

    res.json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.get("/books/aggregate2", async (req, res) => {
  try {
    const books = await db.collection("books").aggregate([
      { $match: { year: { $gt: 2000 } } },
      {
        $project: {
          _id: 0,
          title: 1,
          author: 1,
          year: 1
        }
      }
    ]).toArray();

    res.json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.get("/books/aggregate3", async (req, res) => {
  try {
    const books = await db.collection("books").aggregate([
      { $unwind: "$genres" },
      {
        $project: {
          _id: 0,
          title: 1,
          genres: 1
        }
      }
    ]).toArray();

    res.json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/books/aggregate4", async (req, res) => {
  try {
    const result = await db.collection("logs").aggregate([
      {
        $lookup: {
          from: "books",
          localField: "book_id",
          foreignField: "_id",
          as: "book_details"
        }
      }
    ]).toArray();

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});