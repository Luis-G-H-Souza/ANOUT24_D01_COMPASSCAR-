const request = require('supertest')
const app = require('../../src/app')
const board = require('../mock/createBoard')

const ROUTE = '/cars'

test('Must insert a car successfully', () => {
  return request(app)
    .post(ROUTE)
    .send({ brand: 'honda', model: 'civic', plate: board(), year: '2018' })
    .then(res => {
      expect(res.status).toBe(201)
      expect(res.body.brand).toBe('honda')
    })
})

test('Must return one car per id', () => {
  return app.db('cars')
    .insert({ brand: 'honda', model: 'civic', plate: board(), year: '2018' })
    .then(car => {
      return request(app).get(`${ROUTE}/${car[0]}`)
        .then((res) => {
          expect(res.status).toBe(200)
          expect(res.body.model).toBe('civic')
          expect(res.body.id).toBe(car[0])
        })
    })
})

test('You must not insert a car without a brand', async () => {
  return request(app)
    .post(ROUTE)
    .send({ model: 'civic', plate: board(), year: '2018' })
    .then(res => {
      expect(res.status).toBe(400)
      expect(res.body.error).toBe('brand is required')
    })
})

test('You must not insert a car without a model', async () => {
  return request(app)
    .post(ROUTE)
    .send({ brand: 'volkswagen', plate: board(), year: '2018' })
    .then(res => {
      expect(res.status).toBe(400)
      expect(res.body.error).toBe('model is required')
    })
})

test('You must not insert a car without a year', async () => {
  const plate = await board()
  return request(app)
    .post(ROUTE)
    .send({ brand: 'volkswagen', model: 'jetta', plate, year: '2008' })
    .then(res => {
      expect(res.status).toBe(400)
      expect(res.body.error).toBe('year must be between 2015 and 2025')
    })
})

test('You should not include a car that is not at most 10 years old considering the following year', async () => {
  const plate = await board()
  return request(app)
    .post(ROUTE)
    .send({ brand: 'volkswagen', model: 'jetta', plate })
    .then(res => {
      expect(res.status).toBe(400)
      expect(res.body.error).toBe('year is required')
    })
})

test('You must not insert a car without a plate', async () => {
  return request(app)
    .post(ROUTE)
    .send({ brand: 'lamborghini', model: 'urus', year: '2018' })
    .then(res => {
      expect(res.status).toBe(400)
      expect(res.body.error).toBe('plate is required')
    })
})

test('You should not enter a car without a license plate of the correct format', async () => {
  return request(app)
    .post(ROUTE)
    .send({ brand: 'lamborghini', model: 'urus', year: '2018', plate: '1BC-1D23' })
    .then(res => {
      expect(res.status).toBe(400)
      expect(res.body.error).toBe('plate must be in the correct format ABC-1C34')
    })
})

test('You should not enter a car without a license plate of the correct size', async () => {
  return request(app)
    .post(ROUTE)
    .send({ brand: 'lamborghini', model: 'urus', year: '2018', plate: 'AAA' })
    .then(res => {
      expect(res.status).toBe(400)
      expect(res.body.error).toBe('plate must be in the correct format ABC-1C34')
    })
})

test('You must not enter a car with a registered license plate', async () => {
  const plate = await board()
  return app.db('cars').insert({ brand: 'lamborghini', model: 'urus', year: '2018', plate })
    .then(() => request(app).post(ROUTE)
      .send({ brand: 'lamborghini', model: 'urus', year: '2018', plate })
    )
    .then(res => {
      expect(res.status).toBe(409)
      expect(res.body.error).toBe('car already registered')
    })
})
