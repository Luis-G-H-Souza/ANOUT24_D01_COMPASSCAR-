const request = require('supertest')
const app = require('../../src/app')
const board = require('../mock/createBoard')

const ROUTE = '/cars'

test.skip('Must insert a car successfully', () => {
  return request(app)
    .post(ROUTE)
    .send({ brand: 'honda', model: 'civic', plate: board(), year: '2018' })
    .then(res => {
      expect(res.status).toBe(201)
      expect(res.body.brand).toBe('honda')
      console.log(res.body)
    })
})

test('Must return one car per id', () => {
  return app.db('cars')
    .insert({ brand: 'honda', model: 'civic', plate: board(), year: '2018' })
    .then(car => {
      console.log(car)
      return request(app).get(`${ROUTE}/${car[0]}`)
        .then((res) => {
          console.log(res.body)
          expect(res.status).toBe(200)
          expect(res.body.model).toBe('civic')
          expect(res.body.id).toBe(car[0])
        })
    })
})
