// app/models/album.js

// load mongoose since we need it to define a model
var mongoose = require('mongoose');

module.exports = mongoose.model('Album', {
  albumName   : String,
  albumArtist : String,
  albumGenre  : String,
  albumOwner  : String,
  albumNumberListens : { type: Number, min: 0, max: 999999 },
  albumLastListen : String
});

// validate here instead of in the business logic app/routes.js
// strings should be strings and have length > 0
// numbers should be numbers between 0 - 999999
// dates should be dates?
// created date?
// modified date?