const mongoose = require('mongoose');

const CatSchema = mongoose.Schema({
  id: { type: Number },
  cat_name: { type: String},
  age: { type: Number},
  breed: { type: String},
  color: { type: String},
  gender: { type: String},
  size: { type: String},
  description: { type: String},
  adoption_fee: { type: String},
  location: { type: String},
  image_url: { type: String}
});

const CatsModel = mongoose.model('Cat', CatSchema);

module.exports = CatsModel;
