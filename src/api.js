const request = require('request')
const { promisify } = require('util')
const helpers = require('./helpers')
const author = require('./author.json')

const baseUrl = 'https://api.mercadolibre.com'
const prequest = promisify(request)

function setApi (app) {
  // Product search.
  app.get('/api/items', (req, res) => {
    console.log('PRODUCT SEARCH: /api/items', req.query)
    const { q } = req.query
    request(`${baseUrl}/sites/MLA/search?q=${q}`, (err, response, body) => {
      if (err) {
        console.log('ERROR', err)
        return res.status(500).send(err)
      }

      const { results, filters } = JSON.parse(body)
      const data = {
        author,
        categories: helpers.getCategories(results),
        items: helpers.getItems(results),
        filters
      }

      res.json(data)
    })
  })

  // Product details.
  app.get('/api/items/:id', (req, res) => {
    const { id } = req.params
    console.log(`PRODUCT DETAILS: /api/items/${id}`)
    const detailsRequest = prequest(`${baseUrl}/items/${id}`)
    const descriptionRequest = prequest(`${baseUrl}/items/${id}/description`)

    Promise.all([detailsRequest, descriptionRequest])
      .then(([details, description]) => {
        const detailsObj = JSON.parse(details.body)
        const descriptionObj = JSON.parse(description.body)

        const data = {
          author,
          item: {
            ...helpers.itemAdapter(detailsObj),
            picture: detailsObj.pictures[0].url,
            sold_quantity: detailsObj.sold_quantity,
            description: descriptionObj.plain_text,
            category_id: detailsObj.category_id
          }
        }
        return res.json(data)
      })
      .catch(err => {
        res.status(500).send(err)
      })
  })

  // Category details.
  app.get('/api/categories/:id', (req, res) => {
    const { id } = req.params
    console.log(`CATEGORY DETAILS: /api/categories/${id}`)
    request(`${baseUrl}/categories/${id}`, (err, response, body) => {
      if (err) {
        console.log('ERROR', err)
        return res.status(500).send(err)
      }

      res.json(JSON.parse(body))
    })
  })
}

module.exports = setApi
