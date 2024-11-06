const request = require('supertest')
const app = require('../../src/app')
const board = require('../mock/createBoard')

// const num = getRandomInt(0, 9)
const arrayLetter = []

for (let i = 0; i < 3; i++) {
  const letter = String.fromCharCode(65 + Math.floor(Math.random() * 26))
  arrayLetter.push(letter)
}
console.log(arrayLetter)

test('Must insert a car successfully', () => {
  return request(app)
    .post('/cars')
    .send({ brand: 'honda', model: 'civic', plate: board(), year: '2018' })
    .then(res => {
      expect(res.status).toBe(201)
      expect(res.body.brand).toBe('honda')
    })
})
