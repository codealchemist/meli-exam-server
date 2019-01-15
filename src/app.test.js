const request = require('supertest')
const nock = require('nock')
const app = require('./app')
const whitelist = require('./whitelist.json')
const validOrigin = whitelist[0]
const resultsMock = require('./__mocks__/results.json')
const productMock = require('./__mocks__/product.json')
const categoryMock = require('./__mocks__/category.json')
const meliResultsMock = require('./__mocks__/meli-results.json')
const meliProductMock = require('./__mocks__/meli-product.json')
const meliProductDescriptionMock = require('./__mocks__/meli-product-description.json')
const meliCategoryMock = require('./__mocks__/meli-category.json')
const baseUrl = 'https://api.mercadolibre.com'

// Mock console to avoid output clutter.
console.log = () => {}

describe('api', () => {
  describe('CORS', () => {
    it('should block origin', async () => {
      const response = await request(app)
        .get('/api/items?q=bose')
        .set({ Origin: 'http://invalid-domain.com' })
        .expect(500)

      expect(response.text).toMatch(
        /Origin Not Allowed: http:\/\/invalid-domain.com/
      )
    })
  })

  describe('Product search', () => {
    it('should return search results', async () => {
      // Mock MELI API.
      nock(baseUrl)
        .get('/sites/MLA/search?q=bose')
        .reply(200, meliResultsMock)

      await request(app)
        .get('/api/items?q=bose')
        .set({ Origin: validOrigin })
        .expect(200, resultsMock)
    })

    it('should handle MELI API error', async () => {
      // Mock MELI API.
      nock(baseUrl)
        .get('/sites/MLA/search?q=bose')
        .reply(500)

      await request(app)
        .get('/api/items?q=bose')
        .set({ Origin: validOrigin })
        .expect(500)
    })
  })

  describe('Product details', () => {
    it('should return product details', async () => {
      // Mock MELI API.
      nock(baseUrl)
        .get('/items/MLA606755520')
        .reply(200, meliProductMock)
      nock(baseUrl)
        .get('/items/MLA606755520/description')
        .reply(200, meliProductDescriptionMock)

      // Hit our API.
      await request(app)
        .get('/api/items/MLA606755520')
        .set({ Origin: validOrigin })
        .expect(200, productMock)
    })

    it('should handle error when MELI details endpoint fails', async () => {
      // Mock MELI API.
      nock(baseUrl)
        .get('/items/MLA606755520')
        .reply(500)
      nock(baseUrl)
        .get('/items/MLA606755520/description')
        .reply(200, meliProductDescriptionMock)

      await request(app)
        .get('/api/items/MLA606755520')
        .set({ Origin: validOrigin })
        .expect(500)
    })

    it('should handle error when MELI description endpoint fails', async () => {
      // Mock MELI API.
      nock(baseUrl)
        .get('/items/MLA606755520')
        .reply(200, meliProductMock)
      nock(baseUrl)
        .get('/items/MLA606755520/description')
        .reply(500)

      await request(app)
        .get('/api/items/MLA606755520')
        .set({ Origin: validOrigin })
        .expect(500)
    })

    it('should handle error when all MELI endpoints fails', async () => {
      // Mock MELI API.
      nock(baseUrl)
        .get('/items/MLA606755520')
        .reply(500)
      nock(baseUrl)
        .get('/items/MLA606755520/description')
        .reply(500)

      await request(app)
        .get('/api/items/MLA606755520')
        .set({ Origin: validOrigin })
        .expect(500)
    })
  })

  describe('Category details', () => {
    it('should return category details', async () => {
      // Mock MELI API.
      nock(baseUrl)
        .get('/categories/MLA8618')
        .reply(200, meliCategoryMock)

      await request(app)
        .get('/api/categories/MLA8618')
        .set({ Origin: validOrigin })
        .expect(200, categoryMock)
    })

    it('should handle MELI API error', async () => {
      // Mock MELI API.
      nock(baseUrl)
        .get('/categories/MLA8618')
        .reply(500)

      await request(app)
        .get('/api/categories/MLA8618')
        .set({ Origin: validOrigin })
        .expect(500)
    })
  })
})
