'use strict'

const mongoose = require('mongoose');

const dbSchema = new mongoose.Schema({
  name: String,
  yelpRating: Number,
  mobile_url: String,
  rating_img_url: String,
  review_count: Number,
  yelp_url: String,
  categories: String,
  yelp_snippet_text: String,
  yelp_image_url: String,
  yelp_address: String,
  yelp_neighborhoods: String,
  fs_crossStreet: String,
  fs_hasMenu: Boolean,
  fs_facebook_username: String,
  fs_url: String,
  phone: String,
  coords: String,
  wordCoords: String
})

module.exports = mongoose.model('RestModel', dbSchema)