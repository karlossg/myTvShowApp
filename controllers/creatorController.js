const async = require('async');
const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

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
  res.render('author_form', { title: 'Create Author' });
};

// Handle Show Creator create on POST.
exports.creator_create_post = [

  // Validate fields.
  body('first_name').isLength({ min: 1 }).trim().withMessage('First name must be specified.')
    .isAlphanumeric().withMessage('First name has non-alphanumeric characters.'),
  body('last_name').isLength({ min: 1 }).trim().withMessage('Last name must be specified.')
    .isAlphanumeric().withMessage('Last name has non-alphanumeric characters.'),
  body('date_of_birth', 'Invalid date of birth').optional({ checkFalsy: true }).isISO8601(),
  body('date_of_death', 'Invalid date of death').optional({ checkFalsy: true }).isISO8601(),

  // Sanitize fields.
  sanitizeBody('first_name').trim().escape(),
  sanitizeBody('last_name').trim().escape(),
  sanitizeBody('date_of_birth').toDate(),
  sanitizeBody('date_of_death').toDate(),

  // Process request after validation and sanitization.
  (req, res, next) => {

    // Extract the validation errors from a request.
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/errors messages.
      res.render('creator_form', { title: 'Add Show Creator', creator: req.body, errors: errors.array() });
      return;
    }
    else {
      // Data from form is valid.

      // Create an Author object with escaped and trimmed data.
      const creator = new Creator(
        {
          first_name: req.body.first_name,
          last_name: req.body.last_name,
          date_of_birth: req.body.date_of_birth,
          date_of_death: req.body.date_of_death
        });
      author.save(function (err) {
        if (err) { return next(err); }
        // Successful - redirect to new author record.
        res.redirect(creator.url);
      });
    }
  }
];

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