const mongoose = require("mongoose");

const { Schema } = mongoose;

const categorySchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  img: {
    type: String,
    required: true,
  },
});

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
