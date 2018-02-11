const express = require('express');
const router = express.Router();

// Require controller modules.
const show_controller = require('../controllers/showController');
const creator_controller = require('../controllers/creatorController');
const genre_controller = require('../controllers/genreController');

/// SHOW ROUTES ///

// GET catalog home page.
router.get('/', show_controller.index);

// GET request for creating a Show. NOTE This must come before routes that display Show (uses id).
router.get('/show/create', show_controller.show_create_get);

// POST request for creating Show.
router.post('/show/create', show_controller.show_create_post);

// GET request to delete Show.
router.get('/show/:id/delete', show_controller.show_delete_get);

// POST request to delete Show.
router.post('/show/:id/delete', show_controller.show_delete_post);

// GET request to update Show.
router.get('/show/:id/update', show_controller.show_update_get);

// POST request to update Show.
router.post('/show/:id/update', show_controller.show_update_post);

// GET request for one Show.
router.get('/show/:id', show_controller.show_detail);

// GET request for list of all Show items.
router.get('/shows', show_controller.show_list);

/// CREATOR ROUTES ///

// GET request for creating Creator. NOTE This must come before route for id (i.e. display creator).
router.get('/creator/create', creator_controller.creator_create_get);

// POST request for creating Creator.
router.post('/creator/create', creator_controller.creator_create_post);

// GET request to delete Creator.
router.get('/creator/:id/delete', creator_controller.creator_delete_get);

// POST request to delete Creator.
router.post('/creator/:id/delete', creator_controller.creator_delete_post);

// GET request to update Creator.
router.get('/creator/:id/update', creator_controller.creator_update_get);

// POST request to update Creator.
router.post('/creator/:id/update', creator_controller.creator_update_post);

// GET request for one Creator.
router.get('/creator/:id', creator_controller.creator_detail);

// GET request for list of all Creators.
router.get('/creators', creator_controller.creator_list);

/// GENRE ROUTES ///

// GET request for creating a Genre. NOTE This must come before route that displays Genre (uses id).
router.get('/genre/create', genre_controller.genre_create_get);

//POST request for creating Genre.
router.post('/genre/create', genre_controller.genre_create_post);

// GET request to delete Genre.
router.get('/genre/:id/delete', genre_controller.genre_delete_get);

// POST request to delete Genre.
router.post('/genre/:id/delete', genre_controller.genre_delete_post);

// GET request to update Genre.
router.get('/genre/:id/update', genre_controller.genre_update_get);

// POST request to update Genre.
router.post('/genre/:id/update', genre_controller.genre_update_post);

// GET request for one Genre.
router.get('/genre/:id', genre_controller.genre_detail);

// GET request for list of all Genre.
router.get('/genres', genre_controller.genre_list);



module.exports = router; const