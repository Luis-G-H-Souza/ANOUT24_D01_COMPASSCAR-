const request = require('supertest')
const app = require('../../src/app')
const board = require('../mock/createBoard')

const MAIN_ROUTE = '/items'
let carId
beforeAll(async () => {
  const res = await app.services.car.save([{ brand: 'fiat', model: 'uno', plate: board(), year: '2015' }])
  const car = { ...res }
  carId = car.carInser[0].id
  console.log('id do beforeall', carId)
})

test('Must insert items successfully', () => {
  const item = [
    { name: 'trava eletrica', car_id: carId }
  ]
  console.log('id do test', carId)
  return request(app).put(`/api/v1/cars/${carId}${MAIN_ROUTE}`)
    .send(item)
    .then((result) => {
      expect(result.status).toBe(204)
    })
})

test('You must not insert an empty item', () => {
  const item = [{ name: '', car_id: carId }]
  return request(app).put(`/api/v1/cars/${carId}${MAIN_ROUTE}`)
    .send(item)
    .then((result) => {
      expect(result.status).toBe(400)
      expect(result.body).toBe('items is required')
    })
})

test('You must enter a maximum of 5 items', () => {
  const items = [
    { name: 'Ar condicionado', car_id: carId },
    { name: 'Trava eletrica', car_id: carId },
    { name: 'Vidro Eletrico', car_id: carId },
    { name: 'Banco de couro', car_id: carId },
    { name: 'Central Multimidia', car_id: carId },
    { name: 'Pintura', car_id: carId }

  ]

  return request(app).put(`/api/v1/cars/${carId}${MAIN_ROUTE}`)
    .send(items)
    .then((result) => {
      expect(result.status).toBe(400)
      expect(result.body).toBe('items must be a maximum of 5')
    })
})

test('Cannot insert repeated item', () => {
  const item = [
    { name: 'trava eletrica', car_id: carId }
  ]
  return request(app).put(`/api/v1/cars/${carId}${MAIN_ROUTE}`)
    .send(item)
    .then(() => request(app).put(`/api/v1/cars/${carId}${MAIN_ROUTE}`)
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
  return request(app).put(`/api/v1/cars/${carId}${MAIN_ROUTE}`)
    .send(item)
    .then((result) => {
      expect(result.status).toBe(404)
      expect(result.body).toBe('car not found')
    })
})
