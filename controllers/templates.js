var Template = require('../models/Template');

/**
 * GET /
 * Templates page.
 */

exports.index = function(req, res) {
  Template.find({}, function (err, records) {
    if (err) {
      req.flash('errors', { msg: 'Crap! Could not find templates' });
      return res.redirect('/');
    }
    res.render('templates/index', {
      title: 'Email templates', records: records
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
    if (err) req.flash('errors', { msg: 'Crap! Could not save template' });
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
  console.log('====== running put')
  Template.findOne({'_id': req.params.id}, function(err, item) {

    // update the values
    item.name = req.body.name
    item.body = req.body.body;
    item.type = req.body.type;
    item.availableForUse = req.body.available;

    Template.update({'_id': req.params.id}, item, {safe:true}, function(err, result) {
      if (err) {
        req.flash('errors', { msg: 'Crap! Could not save template' });
        console.log(err);
      }
      return res.redirect('/templates');
    });
  });
};

// this just be new
exports.create1 = function(req, res) {

  var template = new Template({
    name: 'The Best Template',
    body: 'Hello, {{name}}'
  });

  template.save(function(err) {
    if (err) {
      console.log(err);
      req.flash('errors', { msg: 'Crap! Could not save template' });
      return res.redirect('/');
    }
  });

  console.log('======= calling new template');
  res.render('templates', {
    title: 'Templates'
  });
};