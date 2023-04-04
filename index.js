const mongoose = require("mongoose")
require("dotenv").config()
const Album = require("./Album")

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to mongodb atlas...");
    return Album.find({}).sort({ id: 1 }); // Find all albums and sort by id
  })
  .then((albums) => {
    console.log(albums); // Log the sorted albums array to the console
  })
  .catch((e) => {
    console.error(e);
  });