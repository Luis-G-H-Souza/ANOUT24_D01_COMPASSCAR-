const request = require('supertest')
const app = require('../../src/app')
const board = require('../mock/createBoard')

const ROUTE = '/api/v1/cars'

test('Must insert a car successfully', () => {
  const car = [
    { brand: 'honda', model: 'civic', plate: board(), year: '2018' }
  ]
  return request(app)
    .post(ROUTE)
    .send(car)
    .then(res => {
      expect(res.status).toBe(201)
      expect(res.body[0].brand).toBe('honda')
    })
})

test('Must return one car per id', () => {
  const car = [
    { brand: 'honda', model: 'civic', plate: board(), year: '2018' }
  ]
  return app.db('cars')
    .insert(car)
    .then(car => {
      return request(app).get(`${ROUTE}/${car[0]}`)
        .then((res) => {
          expect(res.status).toBe(200)
          expect(res.body.model).toBe('civic')
          expect(res.body.id).toBe(car[0])
        })
    })
})

test('It should return an error if you search for a car with a non-existent id', () => {
  const car = [
    { brand: 'honda', model: 'civic', plate: board(), year: '2018' }
  ]
  return app.db('cars')
    .insert(car)
    .then(car => {
      return request(app).get(`${ROUTE}/a`)
        .then((res) => {
          expect(res.status).toBe(404)
          expect(res.body).toBe('car not found')
        })
    })
})

test('You must not insert a car without a brand', async () => {
  const car = [
    { model: 'civic', plate: board(), year: '2018' }
  ]
  return request(app)
    .post(ROUTE)
    .send(car)
    .then(res => {
      expect(res.status).toBe(400)
      expect(res.body).toBe('brand is required')
    })
})

test('You must not insert a car without a model', async () => {
  const car = [
    { brand: 'volkswagen', plate: board(), year: '2018' }
  ]
  return request(app)
    .post(ROUTE)
    .send(car)
    .then(res => {
      expect(res.status).toBe(400)
      expect(res.body).toBe('model is required')
    })
})

test('You must not insert a car without a year', async () => {
  const plate = await board()
  const car = [
    { brand: 'volkswagen', model: 'jetta', plate, year: '2008' }
  ]
  return request(app)
    .post(ROUTE)
    .send(car)
    .then(res => {
      expect(res.status).toBe(400)
      expect(res.body).toBe('year must be between 2015 and 2025')
    })
})

test('You should not include a car that is not at most 10 years old considering the following year', async () => {
  const plate = await board()
  const car = [
    { brand: 'volkswagen', model: 'jetta', plate }
  ]
  return request(app)
    .post(ROUTE)
    .send(car)
    .then(res => {
      expect(res.status).toBe(400)
      expect(res.body).toBe('year is required')
    })
})

test('You must not insert a car without a plate', async () => {
  const car = [
    { brand: 'lamborghini', model: 'urus', year: '2018' }
  ]
  return request(app)
    .post(ROUTE)
    .send(car)
    .then(res => {
      expect(res.status).toBe(400)
      expect(res.body).toBe('plate is required')
    })
})

test('You should not enter a car without a license plate of the correct format', async () => {
  const car = [
    { brand: 'lamborghini', model: 'urus', year: '2018', plate: '1BC-1D23' }
  ]
  return request(app)
    .post(ROUTE)
    .send(car)
    .then(res => {
      expect(res.status).toBe(400)
      expect(res.body).toBe('plate must be in the correct format ABC-1C34')
    })
})

test('You should not enter a car without a license plate of the correct size', async () => {
  const car = [
    { brand: 'lamborghini', model: 'urus', year: '2018', plate: 'AAA' }
  ]
  return request(app)
    .post(ROUTE)
    .send(car)
    .then(res => {
      expect(res.status).toBe(400)
      expect(res.body).toBe('plate must be in the correct format ABC-1C34')
    })
})

test('You must not enter a car with a registered license plate', async () => {
  const plate = await board()
  const car = [
    { brand: 'lamborghini', model: 'urus', year: '2018', plate }
  ]
  return app.db('cars').insert(car)
    .then(() => request(app).post(ROUTE)
      .send(car)
    )
    .then(res => {
      expect(res.status).toBe(409)
      expect(res.body).toBe('car already registered')
    })
})

test('Must upgrade a car successfully', async () => {
  const res = await app.services.car.save({ brand: 'lamborghini', model: 'urus', year: '2018', plate: board() })

  const carId = res.carInser[0].id

  const newValuesCar =
    { brand: 'Audi', model: 'Q7', year: '2025', plate: board() }
  return request(app).patch(`${ROUTE}/${carId}`)
    .send(newValuesCar)
    .then(res => {
      expect(res.status).toBe(204)
    })
})

test.only('It should be possible to update only some fields', async () => {
  const res = await app.services.car.save({ brand: 'lamborghini', model: 'urus', year: '2018', plate: board() })

  const carId = res.carInser[0].id

  const newValuesCar =
    { brand: 'Audi', model: 'Q7' }
  return request(app).patch(`${ROUTE}/${carId}`)
    .send(newValuesCar)
    .then(res => {
      expect(res.status).toBe(204)
    })
})

test('You should not update a car with a non-existent ID', async () => {
  const res = await app.services.car.save({ brand: 'lamborghini', model: 'urus', year: '2018', plate: board() })

  const carId = res.carInser[0].id * 1000

  const newValuesCar =
    { brand: 'Audi', model: 'Q7', year: '2025', plate: board() }

  return request(app).patch(`${ROUTE}/${carId}`)
    .send(newValuesCar)
    .then(res => {
      expect(res.status).toBe(404)
    })
})

test('You should not update a car with a license plate already registered', async () => {
  const res = await app.services.car.save({ brand: 'lamborghini', model: 'urus', year: '2018', plate: board() })

  const carId = res.carInser[0].id

  const newValuesCar =
    { brand: 'Audi', model: 'Q7', year: '2025', plate: res.carInser[0].plate }

  return request(app).patch(`${ROUTE}/${carId}`)
    .send(newValuesCar)
    .then(res => {
      expect(res.status).toBe(409)
    })
})

test('Updating just a few items', async () => {
  const res = await app.services.car.save({ brand: 'lamborghini', model: 'urus', year: '2018', plate: board() })
  const carId = res.carInser[0].id

  const newValuesCar =
    { brand: 'Audi', model: 'Q7', plate: board() }
  return request(app).patch(`${ROUTE}/${carId}`)
    .send(newValuesCar)
    .then(res => {
      expect(res.status).toBe(204)
    })
})

test('Successfully deleting a car', async () => {
  const res = await app.services.car.save({ brand: 'lamborghini', model: 'urus', year: '2018', plate: board() })
  const carId = res.carInser[0].id
  return request(app)
    .delete(`${ROUTE}/${carId}`)
    .then(res => {
      expect(res.status).toBe(204)
    })
})

test('You cannot delete a car that does not exist', async () => {
  await app.services.car.save({ brand: 'lamborghini', model: 'urus', year: '2018', plate: board() })
  const carId = '999999'
  return request(app)
    .delete(`${ROUTE}/${carId}`)
    .then(res => {
      expect(res.status).toBe(404)
      expect(res.body).toBe('car not found')
    })
})

test('Deleting car along with items', async () => {
  const car = [
    { brand: 'honda', model: 'civic', plate: board(), year: '2018' }
  ]

  return app.db('cars')
    .insert(car)
    .then(carid => {
      const item = [
        'trava eletrica'
      ]
      const carids = carid[0]
      return request(app).put(`/api/v1/cars/${carids}/items`)
        .send(item)
        .then((res) => {
          return request(app)
            .delete(`${ROUTE}/${carids}`)
            .then(res => {
              expect(res.status).toBe(204)
            })
        })
    })
})
