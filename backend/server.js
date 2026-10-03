// Entry point: connects to MongoDB and starts the Express server
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { startAlerts } = require("./utils/alerts");

const app = express();

// Only allow requests from our own frontend when deployed (allows all locally)
app.use(cors({ origin: process.env.FRONTEND_URL || "*" }));
app.use(express.json());

app.use("/api/auth", require("./routes/auth"));
app.use("/api/subjects", require("./routes/subjects"));
app.use("/api/admin", require("./routes/admin"));

// Catches any unexpected error so the server does not crash
app.use((err, req, res, next) => {
  console.log(err.message);
  res.status(500).json({ message: "Server error" });
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    startAlerts();
    app.listen(process.env.PORT || 5000, () => console.log("Server running"));
  })
  .catch((err) => console.log("DB connection failed:", err.message));