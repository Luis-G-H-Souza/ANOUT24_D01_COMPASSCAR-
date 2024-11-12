const request = require('supertest')
const app = require('../../src/app')
const board = require('../mock/createBoard')

const MAIN_ROUTE = '/items'
let carId
beforeAll(async () => {
  const res = await app.services.car.save({ brand: 'fiat', model: 'uno', plate: board(), year: '2015' })
  const car = { ...res }
  carId = car.newCar.id
})

test('Must insert items successfully', () => {
  const item = [
    'trava eletrica'
  ]
  return request(app).put(`/api/v1/cars/${carId}${MAIN_ROUTE}`)
    .send(item)
    .then((result) => {
      expect(result.status).toBe(204)
    })
})

test('You must not insert an empty item', () => {
  const item = ['']
  return request(app).put(`/api/v1/cars/${carId}${MAIN_ROUTE}`)
    .send(item)
    .then((result) => {
      expect(result.status).toBe(400)
      expect(result.body.error[0]).toBe('items is required')
    })
})

test('You must enter a maximum of 5 items', () => {
  const items = [
    'Ar condicionado',
    'Trava eletrica',
    'Vidro Eletrico',
    'Banco de couro',
    'Central Multimidia',
    'Pintura'

  ]

  return request(app).put(`/api/v1/cars/${carId}${MAIN_ROUTE}`)
    .send(items)
    .then((result) => {
      expect(result.status).toBe(400)
      expect(result.body.error[0]).toBe('items must be a maximum of 5')
    })
})

test('Cannot insert repeated item', () => {
  const item = [
    'trava eletrica'
  ]
  return request(app).put(`/api/v1/cars/${carId}${MAIN_ROUTE}`)
    .send(item)
    .then(() => request(app).put(`/api/v1/cars/${carId}${MAIN_ROUTE}`)
      .send(item))
    .then(res => {
      expect(res.status).toBe(400)
      expect(res.body.error[0]).toBe('items cannot be repeated')
    })
})

test('You cannot insert an item for a car that does not exist', () => {
  const item = [
    'trava eletrica'
  ]
  return request(app).put(`/api/v1/cars/a${MAIN_ROUTE}`)
    .send(item)
    .then((result) => {
      expect(result.status).toBe(404)
      expect(result.body.error[0]).toBe('car not found')
    })
})
