const express = require("express");
const { MongoClient } = require("mongodb");

const app = express();
app.use(express.json());

const url = "mongodb://127.0.0.1:27017";
const client = new MongoClient(url);

let db;

async function startServer() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");

    db = client.db("assignment8");

    app.get("/", (req, res) => {
      res.send("Server is running");
    });

    app.get("/test", (req, res) => {
      res.json({ message: "test works" });
    });

    app.post("/users/register", async (req, res) => {
      const { name, email, password } = req.body;

      try {
        const usersCollection = db.collection("users");
        const existingUser = await usersCollection.findOne({ email });

        if (existingUser) {
          return res.json({ message: "User already exists" });
        }

        await usersCollection.insertOne({ name, email, password });

        res.json({ message: "User registered successfully" });
      } catch (error) {
        res.status(500).json({ message: "Error registering user" });
      }
    });

    app.post("/users/login", async (req, res) => {
      const { email, password } = req.body;

      try {
        const usersCollection = db.collection("users");
        const user = await usersCollection.findOne({ email, password });

        if (!user) {
          return res.json({ message: "Invalid email or password" });
        }

        res.json({ message: "Login successful", user });
      } catch (error) {
        res.status(500).json({ message: "Error logging in" });
      }
    });

    app.listen(3000, () => {
      console.log("Server running on http://localhost:3000");
    });
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

startServer();