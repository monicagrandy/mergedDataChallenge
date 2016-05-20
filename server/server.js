'use strict'
const express = require('express');
const bodyParser = require('body-parser');
const apiController = require('./apiController.js');
const mongoose = require('mongoose')
const app = express();
const config = require('./config.js');

const mongooseUsername = config.dbUsername;
const mongoosePassword = config.dbPassword;

mongoose.connect('mongodb://'+mongooseUsername+':'+mongoosePassword+'@ds017672.mlab.com:17672/apitest')
console.log('Line 12 Mongoose is running');

app.use(bodyParser.json())
app.use('/node', express.static(__dirname + '/../node_modules/'));

app.get('/', apiController.getInfo)

module.exports = app;