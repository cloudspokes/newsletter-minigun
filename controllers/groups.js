var _ = require('underscore');
var Group = require('../models/Group');

exports.index = function(req, res) {
  Group.find({}, function (err, records) {
    if (err) { req.flash('errors', { msg: 'Crap! Could not find groups.' }); }
    res.render('groups/index', {
      title: 'Groups', records: records
    });
   });
};

exports.show = function(req, res) {
  Group.findOne({'_id': req.params.id}, function(err, item) {
    res.locals.org.query({ query: item.query + ' limit 10' }, function(err, resp){
      var records = []
      if(!err && resp.records) { records = resp.records; }
      res.render('groups/show', {
        title: 'Group details', record: item, records: records
      });      
    });
  });
};

exports.new = function(req, res) {
  res.render('groups/new', {
    title: 'Create a new group of members'
  });
};

exports.create = function(req, res) {
  var group = new Group({
    name: req.body.name,
    description: req.body.description,
    query: req.body.query,
    availableForUse: req.body.available
  });
  // save the record and redirect
  group.save(function(err) {
    if (err) req.flash('errors', { msg: 'Crap! Could not save the group.' });
    return res.redirect('/groups');
  });
};

exports.edit = function(req, res) {
  Group.findOne({'_id': req.params.id}, function(err, item) {
    res.render('groups/edit', {
      title: 'Edit group', record: item
    });
  });
};

exports.update = function(req, res) {
  var group = _.omit(req.body, '_csrf');
  Group.update({'_id': req.params.id}, group, {raw:false}, function(err, result) {
    if (err) { req.flash('errors', { msg: 'Crap! Could not save group.' }); }
    return res.redirect('/groups/' + req.params.id);
  });
};