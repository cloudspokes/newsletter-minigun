var mongoose = require('mongoose');

var schema = new mongoose.Schema({
  name: {type: String, trim: true },
  description: { type: String, trim: true},
  query: {type: String, trim: true},
  availableForUse: {type: Boolean, default: 1 },
});

module.exports = mongoose.model('ChallengesQuery', schema);