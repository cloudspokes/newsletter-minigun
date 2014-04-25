var mongoose = require('mongoose');
var Template = require('../models/Template').Schema;
var Group = require('../models/Group').Schema;
var ChallengesQuery = require('../models/ChallengesQuery').Schema;

var schema = new mongoose.Schema({
  name: {type: String, trim: true },
  description: { type: String, trim: true},
  content: {type: String},
  template: [Template],
  group: [Group],
  challengesQuery: [ChallengesQuery],
  recipients: {type: Number, default: 0},
  sent: {type: Boolean, default: 0 }, 
  sentDate: {type: Date}
});

module.exports = mongoose.model('Campaign', schema);