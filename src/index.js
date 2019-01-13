const express = require('express')
const setApi = require('./api')
const setCors = require('./cors')

const app = express()
const port = process.env.PORT || 9000
const isDev = process.env.MODE === 'dev'

if (!isDev) setCors(app)
setApi(app)

app.listen(port, () => {
  console.log(`MELI Exam server listening on http://localhost:${port}`)
})
