/**
 * GET /
 * Send mail page.
 */

exports.loadGun = function(req, res) {
  res.render('shoot/index', {
    title: 'Shoot'
  });
};
