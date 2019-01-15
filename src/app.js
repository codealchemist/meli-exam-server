const express = require('express')
const setApi = require('./api')
const setCors = require('./cors')

const app = express()

setCors(app)
setApi(app)

module.exports = app
