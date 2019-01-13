const express = require('express')
const setApi = require('./api')
const setCors = require('./cors')

const app = express()
const port = process.env.PORT || 9000

setCors(app)
setApi(app)

app.listen(port, () => {
  console.log(`MELI Exam server listening on http://localhost:${port}`)
})
