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
  const item = [
    { name: 'trava eletrica', car_id: car.id }
  ]
  return request(app).put(`/cars/${car.id}${MAIN_ROUTE}`)
    .send(item)
    .then((result) => {
      expect(result.status).toBe(204)
    })
})

test('You must not insert an empty item', () => {
  const item = [{ name: '', car_id: car.id }]
  return request(app).put(`/cars/${car.id}${MAIN_ROUTE}`)
    .send(item)
    .then((result) => {
      expect(result.status).toBe(400)
      expect(result.body).toBe('items is required')
    })
})

test('You must enter a maximum of 5 items', () => {
  const items = [
    { name: 'Ar condicionado', car_id: car.id },
    { name: 'Trava eletrica', car_id: car.id },
    { name: 'Vidro Eletrico', car_id: car.id },
    { name: 'Banco de couro', car_id: car.id },
    { name: 'Central Multimidia', car_id: car.id },
    { name: 'Pintura', car_id: car.id }

  ]

  return request(app).put(`/cars/${car.id}${MAIN_ROUTE}`)
    .send(items)
    .then((result) => {
      expect(result.status).toBe(400)
      expect(result.body).toBe('items must be a maximum of 5')
    })
})

test('Cannot insert repeated item', () => {
  const item = [
    { name: 'trava eletrica', car_id: car.id }
  ]
  return request(app).put(`/cars/${car.id}${MAIN_ROUTE}`)
    .send(item)
    .then(() => request(app).put(`/cars/${car.id}${MAIN_ROUTE}`)
      .send(item))
    .then(res => {
      expect(res.status).toBe(400)
      expect(res.body).toBe('items cannot be repeated')
    })
})

test('You cannot insert an item for a car that does not exist', () => {
  const item = [
    { name: 'trava eletrica', car_id: 'a' }
  ]
  return request(app).put(`/cars/${car.id}${MAIN_ROUTE}`)
    .send(item)
    .then((result) => {
      expect(result.status).toBe(404)
      expect(result.body).toBe('car not found')
    })
})
