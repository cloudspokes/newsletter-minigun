var _ = require('underscore');
var ChallengesQuery = require('../models/ChallengesQuery');

exports.index = function(req, res) {
  ChallengesQuery.find({}, function (err, records) {
    if (err) { req.flash('errors', { msg: 'Crap! Could not find challenge queries.' }); }
    res.render('challenges/index', {
      title: 'Challenges Queries', records: records
    });
   });
};

exports.show = function(req, res) {
  ChallengesQuery.findOne({'_id': req.params.id}, function(err, item) {
    res.locals.org.query({ query: item.query + ' limit 10' }, function(err, resp){
      var records = []
      if(!err && resp.records) { records = resp.records; }
      res.render('challenges/show', {
        title: 'Challenges Query details', record: item, records: records
      });      
    });
  });
};

exports.new = function(req, res) {
  res.render('challenges/new', {
    title: 'Create a new challenges query'
  });
};

exports.create = function(req, res) {
  var cq = new ChallengesQuery({
    name: req.body.name,
    description: req.body.description,
    query: req.body.query,
    availableForUse: req.body.available
  });
  // save the record and redirect
  cq.save(function(err) {
    if (err) req.flash('errors', { msg: 'Crap! Could not save the challenges query.' });
    return res.redirect('/challenges');
  });
};

exports.edit = function(req, res) {
  ChallengesQuery.findOne({'_id': req.params.id}, function(err, item) {
    res.render('challenges/edit', {
      title: 'Edit challenges query', record: item
    });
  });
};

exports.update = function(req, res) {
  var cq = _.omit(req.body, '_csrf');
  console.log(cq);
  ChallengesQuery.update({'_id': req.params.id}, cq, {raw:false}, function(err, result) {
    if (err) { req.flash('errors', { msg: 'Crap! Could not save the challenges query.' }); }
    return res.redirect('/challenges/' + req.params.id);
  });
};