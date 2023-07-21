const mongoose = require('mongoose');

// Define the schema
const DogsSchema = mongoose.Schema({
  id: { type: Number },
  image: { type: String, },
  name: { type: String, },
  age: { type: String, },
  breed: { type: String, },
  distance: { type: String, },
  location: { type: String, },
  price: { type: Number, }
});

// Create the model
const DogsModel = mongoose.model('Dog', DogsSchema);

// Export the model
module.exports = DogsModel;
