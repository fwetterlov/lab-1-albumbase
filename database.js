const mongoose = require("mongoose")
require("dotenv").config()
const Album = require("./Album")

mongoose.connect(process.env.MONGODB_URI)

function getAlbums() {
  return Album.find({}).sort({ title: 1 }).exec(); // Find all albums and sort by title
}

module.exports = getAlbums;