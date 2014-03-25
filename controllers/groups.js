/**
 * GET /
 * Groups page.
 */

exports.index = function(req, res) {
  res.render('groups', {
    title: 'Groups'
  });
};
