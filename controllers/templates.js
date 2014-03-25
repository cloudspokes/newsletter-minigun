/**
 * GET /
 * Templates page.
 */

exports.index = function(req, res) {
  res.render('templates', {
    title: 'Templates'
  });
};
