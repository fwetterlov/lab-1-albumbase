const mongoose = require("mongoose")

const albumSchema = new mongoose.Schema({
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
    validate: {
      validator: function (value) {
        return Number.isInteger(value);
      },
      message: props => `${props.value} is not a valid year!`
    }
  }
});

module.exports = mongoose.model("Album", albumSchema)