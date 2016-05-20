# mergedDataChallenge

This project queries the Yelp and Foursquare databases by zipcode for either restaurants or a user specified input. When a search result exists in both Yelp and Foursquare, it's geolocation coordinates are sent to the What 3 Words API. The W3W response as well as the responses from Yelp and Foursquare are then merged and stored in a non-relational database.

#Technology Used:

- Node.js v5.8
- Express
- Mongoose
- mLab

#How to run this project:

- clone down  a copy
- run npm install from the root directory
- open localhost:8080 + /"your yelp/foursquare query"