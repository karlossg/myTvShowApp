const async = require('async');
const mongoose = require('mongoose');
const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

const Genre = require('../models/genre');
const Show = require('../models/show');


// Display list of all Genre.
exports.genre_list = function (req, res) {
  Genre.find()
    .sort([['name', 'ascending']])
    // .distinct('name')
    .exec(function (err, list_genres) {
      if (err) { return next(err); }
      //Successful, so render
      res.render('genre_list', { title: 'Genre List', genre_list: list_genres });
    });

};

// Display detail page for a specific Genre.
exports.genre_detail = function (req, res) {
  const id = mongoose.Types.ObjectId(req.params.id);
  async.parallel({
    genre: function (callback) {
      Genre.findById(id)
        .exec(callback);
    },

    genre_shows: function (callback) {
      Show.find({ 'genre': id })
        .exec(callback);
    },

  }, function (err, results) {
    if (err) { return next(err); }
    if (results.genre == null) { // No results.
      var err = new Error('Genre not found');
      err.status = 404;
      return next(err);
    }

    res.render('genre_detail', { title: 'Genre Detail', genre: results.genre, genre_shows: results.genre_shows });
  });
};

// Display Genre create form on GET.
exports.genre_create_get = function (req, res) {
  res.render('genre_form', { title: 'Create Genre' });
};

// Handle Genre create on POST.
exports.genre_create_post = [

  // Validate that the name field is not empty.
  body('name', 'Genre name required').isLength({ min: 1 }).trim(),

  // Sanitize (trim and escape) the name field.
  sanitizeBody('name').trim().escape(),

  // Process request after validation and sanitization.
  (req, res, next) => {

    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a genre object with escaped and trimmed data.
    const genre = new Genre(
      { name: req.body.name }
    );


    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.render('genre_form', { title: 'Add Genre', genre: genre, errors: errors.array() });
      return;
    }
    else {
      // Data from form is valid.
      // Check if Genre with same name already exists.
      Genre.findOne({ 'name': req.body.name })
        .exec(function (err, found_genre) {
          if (err) { return next(err); }

          if (found_genre) {
            // Genre exists, redirect to its detail page.
            res.redirect(found_genre.url);
          }
          else {

            genre.save(function (err) {
              if (err) { return next(err); }
              // Genre saved. Redirect to genre detail page.
              res.redirect(genre.url);
            });

          }

        });
    }
  }
];

// Display Genre delete form on GET.
exports.genre_delete_get = function (req, res) {
  async.parallel({
    genre: function (callback) {
      Genre.findById(req.params.id).exec(callback)
    },
    genres_shows: function (callback) {
      Show.find({ 'genre': req.params.id }).exec(callback)
    },
  }, function (err, results) {
    if (err) { return next(err); }
    if (results.genre == null) { // No results.
      res.redirect('/catalog/genres');
    }
    // Successful, so render.
    res.render('genre_delete', { title: 'Delete Genre', genre: results.genre, genre_shows: results.genres_shows });
  });
};

// Handle Genre delete on POST.
exports.genre_delete_post = function (req, res) {
  async.parallel({
    genre: function (callback) {
      Genre.findById(req.body.genreid).exec(callback)
    },
    genres_shows: function (callback) {
      Show.find({ 'genre': req.body.genreid }).exec(callback)
    },
  }, function (err, results) {
    if (err) { return next(err); }
    // Success
    if (results.genres_shows.length > 0) {
      // Genre has shows. Render in same way as for GET route.
      res.render('genre_delete', { title: 'Delete Genre', genre: results.genre, genre_shows: results.genres_shows });
      return;
    }
    else {
      // Genre has no shows. Delete object and redirect to the list of genres.
      Genre.findByIdAndRemove(req.body.genreid, function deleteGenre(err) {
        if (err) { return next(err); }
        // Success - go to creator list
        res.redirect('/catalog/genres')
      })
    }
  });
};

// Display Genre update form on GET.
exports.genre_update_get = function (req, res) {
  res.send('NOT IMPLEMENTED: Genre update GET');
};

// Handle Genre update on POST.
exports.genre_update_post = function (req, res) {
  res.send('NOT IMPLEMENTED: Genre update POST');
};