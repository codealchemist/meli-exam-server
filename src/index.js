const app = require('./app')

const port = process.env.PORT || 9000

app.listen(port, () => {
  console.log(`MELI Exam server listening on http://localhost:${port}`)
})
