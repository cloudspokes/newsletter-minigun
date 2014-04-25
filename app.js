/**
 * Module dependencies.
 */

var express = require('express');
var MongoStore = require('connect-mongo')(express);
var flash = require('express-flash');
var path = require('path');
var mongoose = require('mongoose');
var passport = require('passport');
var expressValidator = require('express-validator');
var connectAssets = require('connect-assets');
var nforce = require('nforce');

/**
 * Load controllers.
 */

var homeController = require('./controllers/home');
var shootController = require('./controllers/shoot');
var analyticsController = require('./controllers/analytics');
var templatesController = require('./controllers/templates');
var groupsController = require('./controllers/groups');
var challengesController = require('./controllers/challenges');
var campaignsController = require('./controllers/campaigns');
var userController = require('./controllers/user');

/**
 * API keys + Passport configuration.
 */

var secrets = require('./config/secrets');
var passportConf = require('./config/passport');

/**
 * Create Express server.
 */

var app = express();

/**
 * Mongoose configuration.
 */

mongoose.connect(secrets.db);
mongoose.connection.on('error', function() {
  console.error('✗ MongoDB Connection Error. Please make sure MongoDB is running.');
});

/**
 * Salesforce configuration.
 */

var org = nforce.createConnection({
  clientId: process.env.SFDC_CLIENT_ID,
  clientSecret: process.env.SFDC_CLIENT_SECRET,
  redirectUri: 'http://localhost:3000/oauth/_callback',
  environment: 'production',  // optional, salesforce 'sandbox' or 'production', production default
  mode: 'single' // optional, 'single' or 'multi' user mode, multi default
});

org.authenticate({ username: process.env.SFDC_USERNAME, password: process.env.SFDC_PASSWORD}, function(err, resp){
  // the oauth object was stored in the connection object
  if(err) console.error('✗ Could not connect to Saleforce org.');
  if(!err) console.error('✔ Successfully authenticated to Salesforce org.');
});

/**
 * Express configuration.
 */

var hour = 3600000;
var day = (hour * 24);
var month = (day * 30);

app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(connectAssets({
  paths: ['public/css', 'public/js'],
  helperContext: app.locals
}));
app.use(express.compress());
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.cookieParser());
app.use(express.json());
app.use(express.urlencoded());
app.use(expressValidator());
app.use(express.methodOverride());
app.use(express.session({
  secret: secrets.sessionSecret,
  store: new MongoStore({
    url: secrets.db,
    auto_reconnect: true
  })
}));
app.use(express.csrf());
app.use(passport.initialize());
app.use(passport.session());
app.use(function(req, res, next) {
  res.locals.org = org;
  res.locals.user = req.user;
  res.locals.token = req.csrfToken();
  res.locals.secrets = secrets;
  next();
});
app.use(flash());
app.use(express.static(path.join(__dirname, 'public'), { maxAge: month }));
app.use(function(req, res, next) {
  // Keep track of previous URL
  if (req.method !== 'GET') return next();
  var path = req.path.split('/')[1];
  if (/(auth|login|logout|signup)$/.test(path)) return next();
  req.session.returnTo = req.path;
  next();
});
app.use(app.router);
app.use(function(req, res) {
  res.status(404);
  res.render('404');
});
app.use(express.errorHandler());

/**
 * Application routes.
 */

app.get('/', homeController.index);
app.get('/shoot', shootController.loadGun);
app.get('/analytics', analyticsController.index);
app.get('/templates', templatesController.index);
app.get('/templates/new', templatesController.new);
app.post('/templates/create', templatesController.create);
app.get('/templates/:id', templatesController.show);
app.get('/templates/:id/edit', templatesController.edit);
app.put('/templates/:id', templatesController.update);
app.get('/groups', groupsController.index);
app.get('/groups/new', groupsController.new);
app.post('/groups/create', groupsController.create);
app.get('/groups/:id', groupsController.show);
app.get('/groups/:id/edit', groupsController.edit);
app.put('/groups/:id', groupsController.update);
app.get('/challenges', challengesController.index);
app.get('/challenges/new', challengesController.new);
app.post('/challenges/create', challengesController.create);
app.get('/challenges/:id', challengesController.show);
app.get('/challenges/:id/edit', challengesController.edit);
app.put('/challenges/:id', challengesController.update);
app.get('/campaigns', campaignsController.index);
app.get('/campaigns/start', campaignsController.start);
app.get('/campaigns/preview', campaignsController.preview);
app.get('/campaigns/new', campaignsController.new);
app.post('/campaigns/create', campaignsController.create);
app.get('/campaigns/:id', campaignsController.show);

app.get('/login', userController.getLogin);
app.post('/login', userController.postLogin);
app.get('/logout', userController.logout);
app.get('/signup', userController.getSignup);
app.post('/signup', userController.postSignup);
app.get('/account', passportConf.isAuthenticated, userController.getAccount);
app.post('/account/profile', passportConf.isAuthenticated, userController.postUpdateProfile);
app.post('/account/delete', passportConf.isAuthenticated, userController.postDeleteAccount);
app.get('/account/unlink/:provider', passportConf.isAuthenticated, userController.getOauthUnlink);

/**
 * OAuth routes for sign-in.
 */

app.get('/auth/google', passport.authenticate('google', { scope: 'profile email' }));
app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), function(req, res) {
  res.redirect(req.session.returnTo || '/');
});

/**
 * Start Express server.
 */

app.listen(app.get('port'), function() {
  console.log("✔ Express server listening on port %d in %s mode", app.get('port'), app.settings.env);
});

module.exports = app;
