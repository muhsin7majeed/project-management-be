const mongoose = require("mongoose");

async function connectDB() {
  try {
    const connect = await mongoose.connect(process.env.MONGO_URI);

    console.log(`MongoDB Connected: ${connect.connection.host}`.cyan.underline.bold);
  } catch (err) {
    console.log(err);
  }
}

module.exports = { connectDB };
