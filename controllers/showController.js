const Show = require('../models/show');
const Creator = require('../models/creator');
const Genre = require('../models/genre');

const async = require('async');

exports.index = function (req, res) {

  async.parallel({
    show_count: function (callback) {
      Show.count(callback);
    },
    creator_count: function (callback) {
      Creator.count(callback);
    },
    genre_count: function (callback) {
      Genre.count(callback);
    },
  }, function (err, results) {
    res.render('index', { title: 'My Tv Shows Home Page', error: err, data: results });
  });
};

// Display list of all shows.
exports.show_list = function (req, res) {
  Show.find({}, 'title creator')
    .populate('creator')
    .exec(function (err, list_shows) {
      if (err) { return next(err); }
      //Successful, so render
      res.render('show_list', { title: 'Show List', show_list: list_shows });
    });
};

// Display detail page for a specific show.
exports.show_detail = function (req, res) {
  async.parallel({
    show: function (callback) {

      Show.findById(req.params.id)
        .populate('creator')
        .populate('genre')
        .exec(callback);
    }
  }, function (err, results) {
    if (err) { return next(err); }
    if (results.show == null) { // No results.
      var err = new Error('Show not found');
      err.status = 404;
      return next(err);
    }
    // Successful, so render.
    res.render('show_detail', { title: 'Title', show: results.show });
  })
}
// Display show create form on GET.
exports.show_create_get = function (req, res) {
  res.send('NOT IMPLEMENTED: Show create GET');
};

// Handle show create on POST.
exports.show_create_post = function (req, res) {
  res.send('NOT IMPLEMENTED: Show create POST');
};

// Display show delete form on GET.
exports.show_delete_get = function (req, res) {
  res.send('NOT IMPLEMENTED: Show delete GET');
};

// Handle show delete on POST.
exports.show_delete_post = function (req, res) {
  res.send('NOT IMPLEMENTED: Show delete POST');
};

// Display show update form on GET.
exports.show_update_get = function (req, res) {
  res.send('NOT IMPLEMENTED: Show update GET');
};

// Handle show update on POST.
exports.show_update_post = function (req, res) {
  res.send('NOT IMPLEMENTED: Show update POST');
};