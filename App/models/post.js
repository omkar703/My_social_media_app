const mongoose = require("mongoose");
const user = require("./user");
const Schema = mongoose.Schema;

const postSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "user" },
  Date: { type: Date, default: Date.now },
  content: {
    type: String,
    likes: [{ type: Schema.Types.ObjectId, ref: "user" }],
  },
});

module.exports = mongoose.model("user", postSchema);
