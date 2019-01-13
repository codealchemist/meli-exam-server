const cors = require('cors')
const whitelist = require('./whitelist.json')

function setCors (app) {
  const corsOptions = {
    credentials: true,
    origin: (origin, callback) => {
      if (!origin) return callback('Origin Not Allowed (empty)', false)

      var isAllowed = whitelist.some(allowedDomain => {
        return origin.match('^' + allowedDomain)
      })

      // allowed domain
      if (isAllowed) return callback(null, true)

      // not allowed domain
      callback(`Origin Not Allowed: ${origin}`, false)
    }
  }

  app.use(cors(corsOptions))
}

module.exports = setCors
