var tinyliquid = require("tinyliquid")

/**
 * GET /
 * Send mail page.
 */

exports.loadGun = function(req, res) {

  var render = tinyliquid.compile('Hello, {{name}}');
  var context = tinyliquid.newContext({
    locals: {
      name: 'Lei'
    }
  });

  render(context, function (err) {
    if (err) console.error(err);
    console.log(context.getBuffer());
    // will output: Hello, Lei
  });

  res.render('shoot/index', {
    title: 'Shoot'
  });
};
