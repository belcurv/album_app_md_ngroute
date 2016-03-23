// app/routes.js

// load required modules
var _     = require('underscore'),
    Album = require('./models/album'),
    path  = require('path');

// expose the routes to our app with module.exports
module.exports = function (app) {
  
    // api routes -------------------------------------------------------------
    //   VERB      URL                         DESCRIPTION
    //   GET       /api/albums                 Get all of the albums
    //   POST      /api/albums                 Create a single album
    //   GET       /api/albums/:album_id       Get a single album
    //   PUT       /api/albums/:album_id       Update a album with new info
    //   DELETE    /api/albums/:album_id       Delete a single album

    // ========================= GET -> /api/albums ===========================
    // Gets all albums
    app.get('/api/albums', function (req, res) {
        
        Album.find(function (err, albums) {
            if (err) {
                res.send(err);
            } else {
                res.json(albums);
            }
        });
    });
  
  
    // ======================= GET -> /api/albums/:id =========================
    // Gets a single album
    app.get('/api/albums/:album_id', function (req, res) {
        Album.findById({ _id : req.params.album_id }, function (err, album) {
            if (err) {
                res.send(err);
            } else {
                res.json(album);
            }
        });
    });
  

    // ======================== POST -> /api/albums ===========================
    // Create a single album; send back all albums after creation
    app.post('/api/albums', function (req, res) {

        // store request body data into a new object
        var body = _.pick(req.body, 'albumName', 'albumArtist', 'albumGenre',
                          'albumOwner', 'albumNumberListens',
                          'albumLastListen');

        // create album using info from AJAX request from Angular
        Album.create({
            albumName          : body.albumName.trim(),
            albumArtist        : body.albumArtist.trim(),
            albumGenre         : body.albumGenre.trim(),
            albumOwner         : body.albumOwner.trim(),
            albumNumberListens : body.albumNumberListens,
            albumLastListen    : body.albumLastListen.trim()
        }, function (err, album) {
            if (err) {
                res.send(err);
            } else {
                Album.find(function (err, albums) {    // then fetch all albums
                    if (err) {
                        res.send(err);
                    } else {
                        res.json(albums);
                    }
                });
            }
        });
    });
  

    // ======================== PUT -> /api/albums/:id ========================
    // Update a album with new info
    // Validation is in app/models/album.js
    app.put('/api/albums/:album_id', function (req, res) {
        // store request body data into a new object
        var newAttrs = {},
            query = { '_id' : req.params.album_id },
            options = { 'new' : true },
            body = _.pick(req.body, 'newName', 'newArtist', 'newGenre',
                          'newOwner', 'newListens', 'newLastListen');
    
        // WARNING! returns 'string' w/Postman x-www-form-urlencoded body.
        // But using 'raw' JSON (application/json) object returns 'number' correctly.
        console.log('The type of \"newListens\" is: ' + typeof body.newListens);
        
        // check if 'newName' property exists
        if (body.hasOwnProperty('newName')) {
            newAttrs.albumName = body.newName.trim();
        }
        
        // check if 'newArtist' property exists
        if (body.hasOwnProperty('newArtist')) {
            newAttrs.albumArtist = body.newArtist.trim();
        }
        
        // check if 'newGenre' property exists
        if (body.hasOwnProperty('newGenre')) {
            newAttrs.albumGenre = body.newGenre.trim();
        }
        
        // check if 'newOwner' property exists
        if (body.hasOwnProperty('newOwner')) {
            newAttrs.albumOwner = body.newOwner.trim();
        }
        
        // check if 'newNumberListens' property exists
        if (body.hasOwnProperty('newListens')) {
            newAttrs.albumNumberListens = body.newListens;
        }
        
        // check if 'newLastListen' property exists
        if (body.hasOwnProperty('newLastListen')) {
            newAttrs.albumLastListen = body.newLastListen.trim();
        }
        
        Album.findOneAndUpdate(query, newAttrs, options, function (err, album) {
            if (err) {
                res.send(err);
            } else {
                console.log('album: ' + album);
            }
        });
        
        // get and return all albums after saving updates
        Album.find(function (err, albums) {
            if (err) {
                res.send(err);
            } else {
                res.json(albums);
            }
        });
    
    });


    // Delete a single album
    app.delete('/api/albums/:album_id', function (req, res) {
        Album.remove({
            _id : req.params.album_id
        }, function (err, album) {
            if (err) {
                res.send(err);
            } else {
                // get and return all remaining albums
                Album.find(function (err, albums) {
                    if (err) {
                        res.send(err);
                    } else {
                        res.json(albums);
                    }           // end nested else
                });           // end .find method
            };              // end larger else
        });               // end .remove method
    });                 // end .delete method


    // application routes -----------------------------------------------------
    app.get('*', function (req, res) {
        // load the view file (angular handles front-end page changes)
        res.sendFile(path.join(__dirname, '/public/index.html'));
    });

};