const request = require('supertest')
const app = require('../../src/app')
const board = require('../mock/createBoard')

const MAIN_ROUTE = '/items'
let car

beforeAll(async () => {
  const res = await app.services.car.save({ brand: 'fiat', model: 'uno', plate: board(), year: '2015' })
  car = { ...res }
})

test('Must insert items successfully', () => {
  return request(app).put(`/cars/${car.id}${MAIN_ROUTE}`)
    .send({ name: 'trava eletrica', car_id: car.id })
    .then((result) => {
      expect(result.status).toBe(200)
      expect(result.body.name).toBe('trava eletrica')
    })
})
