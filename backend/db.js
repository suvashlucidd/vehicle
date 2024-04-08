const mongoose = require("mongoose");

// MongoDB Atlas connection string
const username = "suvash_mern";
const password = encodeURIComponent("aaa"); // Encode special characters in the password
const clusterURL = "cluster0.rupk29l.mongodb.net";
const databaseName = "automobile"; // Replace with your actual database name

const mongoURL = `mongodb+srv://${username}:${password}@${clusterURL}/${databaseName}?retryWrites=true&w=majority`;

mongoose.connect(mongoURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log("MongoDB connected successfully");
})
.catch((err) => {
  console.error("MongoDB connection error:", err.message);
});

const connection = mongoose.connection;
connection.on("error", () => {
  console.log("Connection to MongoDB failed");
});
connection.on("connected", () => {
  console.log("Connected to MongoDB successfully");
});

module.exports = mongoose;
