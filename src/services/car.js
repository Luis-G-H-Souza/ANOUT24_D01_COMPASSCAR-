module.exports = (app) => {
  const { validation } = require('../validations/validationcar')
  const find = (filter = {}) => {
    return app.db('cars').where(filter).select('*')
  }

  const findId = (filter = {}) => {
    return app.db('cars').where(filter).first()
  }
  const save = async (car) => {
    try {
      const erro = validation(car)
      if (erro.length > 0) {
        return { error: erro.join(', ') }
      } else {
        const carExists = await app.db('cars').where({ plate: car.plate }).first()
        if (carExists) {
          console.log('raduken')
          return { error: 'car already registered' }
        }
      }
      const result = await app.db('cars').insert(car)
      const newCarId = result[0]
      const newCar = await app.db('cars').where({ id: newCarId }).first()
      return newCar
    } catch (error) {

    }
    // throw error
  }

  return { find, findId, save }
}
