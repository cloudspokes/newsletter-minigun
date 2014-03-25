/**
 * GET /
 * Analytics page.
 */

exports.index = function(req, res) {
  res.render('analytics', {
    title: 'Analytics'
  });
};
