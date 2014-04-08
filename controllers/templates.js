var _ = require('underscore');

var Template = require('../models/Template');

/**
 * GET /
 * Templates page.
 */

exports.index = function(req, res) {
  Template.find({}, function (err, records) {
    if (err) { req.flash('errors', { msg: 'Crap! Could not find templates.' }); }
    res.render('templates/index', {
      title: 'Email templates', records: records
    });
   });
};

exports.show = function(req, res) {
  Template.findOne({'_id': req.params.id}, function(err, item) {
    res.render('templates/show', {
      title: 'Template details', record: item
    });
  });
};

exports.new = function(req, res) {
  res.render('templates/new', {
    title: 'Create a new template'
  });
};

exports.create = function(req, res) {
  var template = new Template({
    name: req.body.name,
    body: req.body.body,
    type: req.body.type,
    availableForUse: req.body.available
  });
  // save the record and redirect
  template.save(function(err) {
    if (err) req.flash('errors', { msg: 'Crap! Could not save the template.' });
    return res.redirect('/templates');
  });
};

exports.edit = function(req, res) {
  Template.findOne({'_id': req.params.id}, function(err, item) {
    res.render('templates/edit', {
      title: 'Edit template', record: item
    });
  });
};

exports.update = function(req, res) {
  var template = _.omit(req.body, '_csrf');
  Template.update({'_id': req.params.id}, template, {raw:false}, function(err, result) {
    if (err) { req.flash('errors', { msg: 'Crap! Could not save template.' }); }
    return res.redirect('/templates');
  });
};