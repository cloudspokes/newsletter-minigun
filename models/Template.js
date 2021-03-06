var mongoose = require('mongoose');

var schema = new mongoose.Schema({
  name: {type: String, trim: true },
  type: {type: String, trim: true},
  availableForUse: {type: Boolean, default: 1 },
  body: { type: String, trim: true}
});

module.exports = mongoose.model('Template', schema);