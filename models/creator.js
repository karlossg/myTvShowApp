const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CreatorSchema = new Schema({
  first_name: { type: String, required: true, max: 100 },
  last_name: { type: String, required: true, max: 100 },
  date_of_birth: { type: Date },
  date_of_death: { type: Date }
})

//virtual for creators full name
CreatorSchema
  .virtual('name')
  .get(function () {
    return `${this.last_name}`, ${ this.first_name };
  })

//virtual for creators url
CreatorSchema
  .virtual('url')
  .get(function () {
    return `/catalog/creator/${this._id}`
  })

//export model
module.exports = mongoose.model('Creator', CreatorSchema);