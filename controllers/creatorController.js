const async = require('async');
const Show = require('../models/show');
const Creator = require('../models/creator');

// Display list of all Creators.
exports.creator_list = function (req, res) {
  Creator.find()
    .sort([['last_name', 'ascending']])
    .exec(function (err, list_creators) {
      if (err) { return next(err); }
      //Successful, so render
      res.render('creator_list', { title: 'Show Creator List', creator_list: list_creators });
    });
};

// Display detail page for a specific Creator.
exports.creator_detail = function (req, res) {
  async.parallel({
    creator: function (callback) {
      Creator.findById(req.params.id)
        .exec(callback)
    },
    creators_shows: function (callback) {
      Show.find({ 'creator': req.params.id }, 'title summary')
        .exec(callback)
    },
  }, function (err, results) {
    if (err) { return next(err); } // Error in API usage.
    if (results.creator == null) { // No results.
      var err = new Error('Creator not found');
      err.status = 404;
      return next(err);
    }
    // Successful, so render.
    res.render('creator_detail', { title: 'Creator Detail', creator: results.creator, creator_shows: results.creators_shows });
  });

};

// Display Creator create form on GET.
exports.creator_create_get = function (req, res) {
  res.send('NOT IMPLEMENTED: Creator create GET');
};

// Handle Creator create on POST.
exports.creator_create_post = function (req, res) {
  res.send('NOT IMPLEMENTED: Creator create POST');
};

// Display Creator delete form on GET.
exports.creator_delete_get = function (req, res) {
  res.send('NOT IMPLEMENTED: Creator delete GET');
};

// Handle Creator delete on POST.
exports.creator_delete_post = function (req, res) {
  res.send('NOT IMPLEMENTED: Creator delete POST');
};

// Display Creator update form on GET.
exports.creator_update_get = function (req, res) {
  res.send('NOT IMPLEMENTED: Creator update GET');
};

// Handle Creator update on POST.
exports.creator_update_post = function (req, res) {
  res.send('NOT IMPLEMENTED: Creator update POST');
};