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
  res.send('NOT IMPLEMENTED: Creator detail: ' + req.params.id);
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