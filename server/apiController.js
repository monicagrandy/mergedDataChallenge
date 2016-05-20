'use strict'
const config = require('./config.js')
const RestModel = require('./dbSchema.js');
const Foursquare = require('foursquarevenues')(config.FourSquareClientID, config.FourSquareClientSecret)
const Yelp = require('yelp')
const W3W = require('geo.what3words')

const makeYelp = new Yelp({
  consumer_key: config.YelpApiKey,
  consumer_secret: config.YelpSecret,
  token: config.YelpToken,
  token_secret: config.YelpTokenSecret
});


const makeW3W =  new W3W(config.W3WAPIKEY)

module.exports = {
  getInfo: (req, res) => {
    makeYelp.search({term: 'restaurant', location: 90012})
      .then(yelpData => {
        Foursquare.getVenues({near: 90012, query: 'restaurant'}, (error, venues) => {
            if(!error){
              let dupes = []
              let allYelp = yelpData.businesses
              let allFS = venues.response.venues
              let yelpPhones = {}
              let merged = {}
              allYelp.forEach(function(yelpPlace){
                yelpPhones[yelpPlace.phone] = true
              })
              let FSPhones = {}
              allFS.forEach(function(FSPlace){
                FSPhones[FSPlace.contact.phone] = true
              })
              for(let key in yelpPhones){
                if(FSPhones[key]){
                  dupes.push(key)
                }
              }
              for(let i = 0; i < allYelp.length; i++){
                let currYelp = allYelp[i]
                for(let j = 0; j < dupes.length; j++){
                  let currPhone = dupes[j]
                  if(currYelp.phone === currPhone){ 
                    merged[currPhone] = {
                      name: currYelp.name,
                      phone: currYelp.phone,
                      yelpRating: currYelp.rating,
                      mobile_url: currYelp.mobile_url,
                      rating_img_url: currYelp.rating_img_url,
                      review_count: currYelp.review_count,
                      rating_img_url_small: currYelp.rating_img_url_small,
                      yelp_url: currYelp.url,
                      categories: currYelp.categories,
                      yelp_snippet_text: currYelp.snippet_text,
                      yelp_image_url: currYelp.image_url,
                      yelp_address: currYelp.location.display_address.join(""),
                      yelp_neighborhoods: currYelp.location.neighborhoods.join("")
                    }
                  }
                }
              }
              for(let k = 0; k < allFS.length; k++){
                let currFS = allFS[k]
                for(let l = 0; l < dupes.length; l++){
                  let currPhone = dupes[l]
                  if(currFS.contact.phone === currPhone){
                    merged[currPhone].coords = currFS.location.lat.toString() + "," + currFS.location.lng.toString()
                    merged[currPhone].fs_crossStreet = currFS.location.crossStreet
                    merged[currPhone].fs_hasMenu = currFS.hasMenu
                    merged[currPhone].fs_menuLink = currFS.menu.url
                    merged[currPhone].fs_facebook_username = currFS.contact.facebookUsername
                    merged[currPhone].fs_url = currFS.url
                  }
                }
              }
              for(let key in merged){
                makeW3W.positionToWords({
                  position: merged[key].coords
                }).then(response => {
                  merged[key].words = response
                  let restaurant = new RestModel ({
                    name: merged[key].name,
                    yelpRating: merged[key].yelpRating,
                    mobile_url: merged[key].mobile_url,
                    rating_img_url: merged[key].rating_img_url,
                    review_count: merged[key].review_count,
                    rating_img_url_small: merged[key].rating_img_url_small,
                    url: merged[key].url,
                    categories: merged[key].categories,
                    yelp_snippet_text: merged[key].yelp_snippet_text,
                    yelp_image_url: merged[key].yelp_image_url,
                    yelp_address: merged[key].yelp_address,
                    yelp_neighborhoods: merged[key].yelp_neighborhoods,
                    fs_crossStreet: merged[key].fs_crossStreet,
                    fs_hasMenu: merged[key].fs_hasMenu,
                    fs_menuLink: merged[key].fs_menuLink,
                    fs_facebook_username: merged[key].fs_facebook_username,
                    phone: merged[key].phone,
                    coords: merged[key].coords,
                    words: response
                  }) 
                  RestModel.findOne({
                    phone: merged[key].phone
                  }, (err,obj) => {
                  if(obj === null){
                    restaurant.save(err => {
                      if(!err){
                        console.log("saved")
                      }
                    })
                  }
                })
              })  
            }
          setTimeout(()=>{res.json(merged)}, 1000)
        }
      })
    })
  }
} 