var _ = require('underscore');
var Q = require("q");
var tinyliquid = require("tinyliquid")
var Campaign = require('../models/Campaign');
var Template = require('../models/Template');
var Group = require('../models/Group');
var ChallengesQuery = require('../models/ChallengesQuery');

exports.index = function(req, res) {
  Campaign.find({}, function (err, records) {
    if (err) { req.flash('errors', { msg: 'Crap! Could not find any campaigns.' }); }
    res.render('campaigns/index', {
      title: 'Campaigns', records: records
    });
   });
};

exports.start = function(req, res) {
  var allData = Q.all([ templates(), groups(), challengeQueries()])

  allData
    .then(function (data) {

      // add select option
      data[1].unshift({name: "-- Choose Recipients --", _id: ""})

      if (_.isEmpty(req.query.t)) {
        data[0].unshift({name: "-- Choose a Template --", _id: ""});
      } else {
        // find the template
        var selectedTemplate = _.find(data[0], function(item){ return String(item._id) === String(req.query.t); });
      }

      if (_.isEmpty(req.query.cq)) {
        data[2].unshift({name: "-- Choose Challenges to Use --", _id: ""})
      } else {
        var selectedCQ = _.find(data[2], function(item){ return String(item._id) === String(req.query.cq); });
      } 

      if (selectedTemplate && selectedCQ) {

        challengeRecords(res.locals.org, selectedCQ.query)
          .then(function (challengeData) {
            renderTemplate(selectedTemplate.body, challengeData)
              .then(function (html) {

                res.render('campaigns/start', {
                  title: 'Create a new campaign',
                  templates: data[0],
                  groups: data[1],
                  challenges: data[2],
                  templateId: req.query.t,
                  cqId: req.query.cq,
                  html: html
                })   

              });
        });     
      }  else {
        res.render('campaigns/start', {
          title: 'Create a new campaign',
          templates: data[0],
          groups: data[1],
          challenges: data[2],
          templateId: req.query.t,
          cqId: req.query.cq
        })        
      }

  });
};

exports.preview = function(req, res) {

  var allData = Q.all([ templateById(req.query.t), 
    groupById(req.query.g), challengesQueryById(req.query.c)])

  // when they all return, add the record
  allData
    .then(function (data) {

      renderTemplate(data[0].body)
        .then(function (rendered) {
          res.render('campaigns/preview', {
            title: data[0].name, 
            body: rendered
          });
        })


    })  

};

exports.preview1 = function(req, res) {
  // get the objects that were selected
  var allData = Q.all([ templateById(req.body.template), 
    groupById(req.body.group), challengesQueryById(req.body.challengesQuery),
    templates(), groups(), challengeQueries() ])

  // when they all return, add the record
  allData
    .then(function (data) {

      renderTemplate(data[0].body).then(function (rendered) {
        console.log(rendered);

        //challengeRecords(data[2].query);
        var campaign = new Campaign({
          name: req.body.name,
          description: req.body.description,
        });
        campaign.template.push(data[0]);
        campaign.group.push(data[1]);
        campaign.challengesQuery.push(data[2]);
        res.render('campaigns/preview', {
          title: 'Campaign Preview', 
          record: campaign,
          templates: data[3],
          groups: data[4],
          challenges: data[5],
          preview: rendered
        });

      })
  })
};

exports.show = function(req, res) {
  Campaign.findOne({'_id': req.params.id}, function(err, item) {
    console.log(item)
    res.render('campaigns/show', {
      title: 'Campaign details', record: item
    });
  });
};

exports.new = function(req, res) {
  var allData = Q.all([ templates(), groups(), challengeQueries() ])
  allData.then(function (data) {
    res.render('campaigns/new', {
      title: 'Create a new campaign',
      templates: data[0],
      groups: data[1],
      challenges: data[2]
    })
  });
};

exports.create = function(req, res) {
  // get the objects that were selected
  var allData = Q.all([ templateById(req.body.template), 
    groupById(req.body.group), challengesQueryById(req.body.challengesQuery) ]);
  // when they all return, add the record
  console.log(req.body)
  allData.then(function (data) {
    var campaign = new Campaign({
      name: req.body.name,
      description: req.body.description,
      content: req.body.content
    });
    campaign.template.push(data[0]);
    campaign.group.push(data[1]);
    campaign.challengesQuery.push(data[2]);
    console.log(campaign)
    // save the record and redirect
    campaign.save(function(err) {
      if (err) req.flash('errors', { msg: 'Crap! Could not save the campaign: ' + err });
      return res.redirect('/campaigns');
    });
  })
};

function templateById (id) {
  var deferred = Q.defer()
   Template.findOne({'_id': id}, function(err, data) {
    if (err) deferred.reject(err)
    else deferred.resolve(data)
  })
  return deferred.promise
}

function templates () {
  var deferred = Q.defer()
   Template.find({}, function (err, data) {
    if (err) deferred.reject(err)
    else deferred.resolve(data)
  })
  return deferred.promise
}

function groups () {
  var deferred = Q.defer()
   Group.find({}, function (err, data) {
    if (err) deferred.reject(err)
    else deferred.resolve(data)
  })
  return deferred.promise
}

function groupById (id) {
  var deferred = Q.defer()
   Group.findOne({'_id': id}, function(err, data) {
    if (err) deferred.reject(err)
    else deferred.resolve(data)
  })
  return deferred.promise
}

function challengeQueries () {
  var deferred = Q.defer()
   ChallengesQuery.find({}, function (err, data) {
    if (err) deferred.reject(err)
    else deferred.resolve(data)
  })
  return deferred.promise
}

function challengesQueryById (id) {
  var deferred = Q.defer()
   ChallengesQuery.findOne({'_id': id}, function(err, data) {
    if (err) deferred.reject(err)
    else deferred.resolve(data)
  })
  return deferred.promise
}

function challengeRecords (org, qry) {
  console.log('running challenges query: ' + qry)
  var deferred = Q.defer()
  org.query({ query: qry }, function(err, resp){ 
    console.log("records returned: " + resp.records.length);
    if (err) deferred.reject(err) 
    else deferred.resolve(resp.records) 
  });
  return deferred.promise 
}

function renderTemplate (template, data) {
  var deferred = Q.defer()
  var render = tinyliquid.compile(template);
  var context = tinyliquid.newContext({
    locals: {
      challenges: data,
    }
  });

  render(context, function (err) {
    console.log(context.getBuffer());
    if (err) deferred.reject(err)
    deferred.resolve(context.getBuffer());
  });
  return deferred.promise 
}

