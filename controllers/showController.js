const async = require('async');
const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

const Show = require('../models/show');
const Creator = require('../models/creator');
const Genre = require('../models/genre');

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
    res.render('index', { title: 'My Tv Shows App', error: err, data: results });
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
      const err = new Error('Show not found');
      err.status = 404;
      return next(err);
    }
    // Successful, so render.
    res.render('show_detail', { title: 'Title', show: results.show });
  })
}
// Display show create form on GET.
exports.show_create_get = function (req, res) {
  // Get all show creators and genres, which we can use for adding to our show.
  async.parallel({
    creators: function (callback) {
      Creator.find(callback);
    },
    genres: function (callback) {
      Genre.find(callback);
    },
  }, function (err, results) {
    if (err) { return next(err); }
    res.render('show_form', { title: 'Add Show', creators: results.creators, genres: results.genres });
  });
};

// Handle show create on POST.
exports.show_create_post = [
  // Convert the genre to an array.
  (req, res, next) => {
    if (!(req.body.genre instanceof Array)) {
      if (typeof req.body.genre === 'undefined')
        req.body.genre = [];
      else
        req.body.genre = new Array(req.body.genre);
    }
    next();
  },

  // Validate fields.
  body('title', 'Title must not be empty.').isLength({ min: 1 }).trim(),
  body('creator', 'Creator must not be empty.').isLength({ min: 1 }).trim(),
  body('summary', 'Summary must not be empty.').isLength({ min: 1 }).trim(),


  // Sanitize fields.
  sanitizeBody('title').trim().escape(),
  sanitizeBody('creator').trim().escape(),
  sanitizeBody('summary').trim().escape(),
  sanitizeBody('imdb_db').trim().escape(),
  sanitizeBody('seasons').trim().escape(),
  sanitizeBody('poster').trim(),
  sanitizeBody('genre.*').trim().escape(),

  // Process request after validation and sanitization.
  (req, res, next) => {

    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a Show object with escaped and trimmed data.
    const show = new Show(
      {
        title: req.body.title,
        creator: req.body.creator,
        summary: req.body.summary,
        imdb_id: req.body.imdb_id,
        genre: req.body.genre,
        poster: req.body.poster,
        seasons: req.body.seasons
      });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.

      // Get all creators and genres for form.
      async.parallel({
        creators: function (callback) {
          Creator.find(callback);
        },
        genres: function (callback) {
          Genre.find(callback);
        },
      }, function (err, results) {
        if (err) { return next(err); }

        // Mark our selected genres as checked.
        for (let i = 0; i < results.genres.length; i++) {
          if (show.genre.indexOf(results.genres[i]._id) > -1) {
            results.genres[i].checked = 'true';
          }
        }
        res.render('show_form', { title: 'Add Show', creators: results.creators, genres: results.genres, show: show, errors: errors.array() });
      });
      return;
    }
    else {
      // Data from form is valid. Save show.
      show.save(function (err) {
        if (err) { return next(err); }
        //successful - redirect to new show record.
        res.redirect(show.url);
      });
    }
  }
];

// Display show delete form on GET.
exports.show_delete_get = function (req, res) {
  Show.findById(req.params.id).exec(function (err, show) {
    if (err) { return next(err) };
    //Successful, so render
    res.render('show_delete', { title: 'Delete Show', show: show });
  });
};

// Handle show delete on POST.
exports.show_delete_post = function (req, res) {
  Show.findById(req.body.showid).exec(function (err, show) {
    if (err) { return next(err); }
    Show.findByIdAndRemove(req.body.showid, function deleteShow(err) {
      if (err) { return next(err); }
      // Success - go to shows list
      res.redirect('/catalog/shows')
    });
  });
};

// Display show update form on GET.
exports.show_update_get = function (req, res) {
  // Get show, creators and genres for form.
  async.parallel({
    show: function (callback) {
      Show.findById(req.params.id).populate('creator').populate('genre').exec(callback);
    },
    creators: function (callback) {
      Creator.find(callback);
    },
    genres: function (callback) {
      Genre.find(callback);
    },
  }, function (err, results) {
    if (err) { return next(err); }
    if (results.show == null) { // No results.
      const err = new Error('Show not found');
      err.status = 404;
      return next(err);
    }
    // Success.
    // Mark our selected genres as checked.
    for (let all_g_iter = 0; all_g_iter < results.genres.length; all_g_iter++) {
      for (let show_g_iter = 0; show_g_iter < results.show.genre.length; show_g_iter++) {
        if (results.genres[all_g_iter]._id.toString() == results.show.genre[show_g_iter]._id.toString()) {
          results.genres[all_g_iter].checked = 'true';
        }
      }
    }
    res.render('show_form', { title: 'Update Show', creators: results.creators, genres: results.genres, show: results.show });
  });

};

// Handle show update on POST.
exports.show_update_post = [

  // Convert the genre to an array
  (req, res, next) => {
    if (!(req.body.genre instanceof Array)) {
      if (typeof req.body.genre === 'undefined')
        req.body.genre = [];
      else
        req.body.genre = new Array(req.body.genre);
    }
    next();
  },

  // Validate fields.
  body('title', 'Title must not be empty.').isLength({ min: 1 }).trim(),
  body('creator', 'Creator must not be empty.').isLength({ min: 1 }).trim(),
  body('summary', 'Summary must not be empty.').isLength({ min: 1 }).trim(),


  // Sanitize fields.
  sanitizeBody('title').trim().escape(),
  sanitizeBody('creator').trim().escape(),
  sanitizeBody('summary').trim().escape(),
  sanitizeBody('imdb_db').trim().escape(),
  sanitizeBody('seasons').trim().escape(),
  sanitizeBody('poster').trim(),
  sanitizeBody('genre.*').trim().escape(),

  // Process request after validation and sanitization.
  (req, res, next) => {

    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a Show object with escaped/trimmed data and old id.
    const show = new Show(
      {
        title: req.body.title,
        creator: req.body.creator,
        summary: req.body.summary,
        imdb_id: req.body.imdb_id,
        seasons: req.body.seasons,
        poster: req.body.poster,
        genre: (typeof req.body.genre === 'undefined') ? [] : req.body.genre,
        _id: req.params.id //This is required, or a new ID will be assigned!
      });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.

      // Get all creators and genres for form.
      async.parallel({
        creators: function (callback) {
          Creator.find(callback);
        },
        genres: function (callback) {
          Genre.find(callback);
        },
      }, function (err, results) {
        if (err) { return next(err); }

        // Mark our selected genres as checked.
        for (let i = 0; i < results.genres.length; i++) {
          if (show.genre.indexOf(results.genres[i]._id) > -1) {
            results.genres[i].checked = 'true';
          }
        }
        res.render('show_form', { title: 'Update Show', creators: results.creators, genres: results.genres, show: show, errors: errors.array() });
      });
      return;
    }
    else {
      // Data from form is valid. Update the record.
      Show.findByIdAndUpdate(req.params.id, show, {}, function (err, theshow) {
        if (err) { return next(err); }
        // Successful - redirect to show detail page.
        res.redirect(theshow.url);
      });
    }
  }
];