use("assignment8");

db.createCollection("books", {
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

db.authors.insertOne({
  name: "author1",
  nationality: "British"
});

db.createCollection("logs", {
  capped: true,
  size: 1024 * 1024
});

db.books.createIndex({ title: 1 });

db.books.insertOne({
  title: "Book1",
  author: "Ali",
  year: 1997,
  genres: ["Fantasy", "Adventure"]
});

db.books.insertMany([
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

db.logs.insertOne({
  book_id: "some_book_id",
  action: "borrowed",
  date: new Date()
});

db.books.find();
db.books.findOne({ title: "Book1" });
db.books.find({ year: { $gte: 1950, $lte: 2025 } });
db.books.find({ genres: "Fantasy" });
db.books.find().sort({ year: -1 }).skip(2).limit(3);
db.books.find({ genres: { $nin: ["Horror", "Science Fiction"] } });

db.books.deleteMany({
  year: { $lt: 2000 }
});

db.books.aggregate([
  { $match: { year: { $gt: 2000 } } },
  { $sort: { year: -1 } }
]);

db.books.aggregate([
  { $match: { year: { $gt: 2000 } } },
  {
    $project: {
      _id: 0,
      title: 1,
      author: 1,
      year: 1
    }
  }
]);

db.books.aggregate([
  { $unwind: "$genres" },
  {
    $project: {
      _id: 0,
      title: 1,
      genres: 1
    }
  }
]);

db.logs.aggregate([
  {
    $lookup: {
      from: "books",
      localField: "book_id",
      foreignField: "_id",
      as: "book_details"
    }
  }
]);