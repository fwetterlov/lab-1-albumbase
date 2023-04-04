const mongoose = require("mongoose")

const albumSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  artist: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
    min: 1880,
    max: new Date().getFullYear(),
    required: true,
  }
});

module.exports = mongoose.model("Album", albumSchema)