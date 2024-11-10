module.exports = (app) => {
  const { validation } = require('../validations/validationcar')
  const find = (filter = {}, limit, offset) => {
    return app.db('cars')
      .limit(limit)
      .offset(offset)
      .modify(queryBuilder => {
        if (filter.year) {
          queryBuilder.where('year', '>=', filter.year)
        }
        if (filter.plate) {
          queryBuilder.where('plate', 'LIKE', `%${filter.plate}`)
        }
        if (filter.brand) {
          queryBuilder.where('brand', 'LIKE', `%${filter.brand}%`)
        }
      })
      .select('*')
  }
  const count = () => {
    return app.db('cars').count('id as total').first()
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
        const items = await app.db('cars_items')
          .where({ car_id: i.id })
          .select()

        idCar.push({
          ...carExist,
          items
        })
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

  return { find, count, findId, save }
}
