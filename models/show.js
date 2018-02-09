const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ShowSchema = new Schema({
  title: { type: String, required: true },
  poster: { type: String }
  creator: { type: Schema.ObjectId, ref: 'Creator', required: true },
  summary: { type: String, required: true },
  seasons: { type: Number },
  imdb_id: { type: String },
  genre: [{ type: Schema.ObjectId, ref: 'Genre' }]
});

// Virtual for book's URL
ShowSchema
  .virtual('url')
  .get(function () {
    return `/catalog/show/${this._id}`;
  });

//Export model
module.exports = mongoose.model('Show', ShowSchema);