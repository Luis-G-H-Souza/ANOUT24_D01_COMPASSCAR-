module.exports = (app) => {
  const { validation } = require('../validations/validationcar')
  const find = (filter = {}) => {
    return app.db('cars').where(filter).select('*')
  }

  const findId = async (car, filter = {}) => {
    const err = []
    const idCar = []
    for (const i of car) {
      const carExist = await app.db('cars')
        .where({ id: i.id })
        .first()
      if (!carExist) {
        err.push({ error: 'car not found' })
      } else {
        idCar.push(carExist)
      }
    }

    if (err.length > 0) {
      return err
    }
    return idCar
  }
  const save = async (car) => {
    try {
      const Errors = []
      const carInser = []
      for (const i of car) {
        const erro = validation(i)
        if (erro.length > 0) {
          const valErro = { error: erro.join(', ') }
          Errors.push(valErro)
        } else {
          const carExists = await app.db('cars').where({ plate: i.plate }).first()
          if (carExists) {
            const carError = { error: 'car already registered' }
            Errors.push(carError)
          }
        }
      }
      if (Errors.length > 0) {
        return { Errors, carInser: [] }
      }
      for (const i of car) {
        try {
          const result = await app.db('cars').insert(i)
          const newCarId = result[0]
          const newCar = await app.db('cars').where({ id: newCarId }).first()
          carInser.push(newCar)
        } catch {}
      }
      return { Errors, carInser }
    } catch (error) {

    }
    // throw error
  }

  return { find, findId, save }
}
