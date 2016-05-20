'use strict'

const app = require('./server/server.js')
const port = 8080;

app.listen(port)

console.log("Express server listening on ", port);