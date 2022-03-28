const mongoose = require("mongoose");

// const mongoose = require("mongoose"),
//     Schema = mongoose.Schema,
//     autoIncrement = require('mongoose-auto-increment');
//     var connection = mongoose.createConnection("mongodb://localhost/Home_Tutors");

// autoIncrement.initialize(connection);
const UserSchema = new mongoose.Schema(
  {
    // _id: {type: String, required: true},
    user_id: { type: String },
    post_title: { type: String },
    post_subject: { type: String },
    post_depart: { type: String },
    post_price: { type: String },
    post_time: { type: String },
    post_location: { type: String },
    post_description: { type: String },
    post_userData: { type: String },
    post_geoLocation: { type: String },
    post_type: { type: String },
    post_createdAt: { type: Date, required: true, default: Date.now },
  },
  { timestamps: true }
);

// UserSchema.plugin(autoIncrement.plugin, {
//   model: 'Home-Tutors-Club',
//   field: '_id'
// });

module.exports = mongoose.model("proposal", UserSchema);
