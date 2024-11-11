module.exports = (app) => {
  const { validation, validationPlate, validationYear } = require('../validations/validationcar')

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
      const carsToProcess = Array.isArray(car) ? car : [car]
      for (const i of carsToProcess) {
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
      for (const i of carsToProcess) {
        try {
          const result = await app.db('cars').insert(i)
          const newCarId = result[0]
          const newCar = await app.db('cars').where({ id: newCarId }).first()
          carInser.push(newCar)
        } catch {}
      }
      if (Errors.length === 0) {
        return { carInser }
      } else {
        return { Errors, carInser }
      }
    } catch (error) {

    }
    // throw error
  }

  const update = async (id, car) => {
    const result = await app.db('cars')
      .where({ id: id.id })
    if (result.length === 0) {
      return { error: 'car not found' }
    }
    const updateItens = {}
    if (car.brand && car.model) { updateItens.brand = car.brand } else if (car.brand && !car.model) { return { error: 'model must also be informed' } }
    console.log('console do update1', updateItens)
    if (car.model) updateItens.model = car.model
    console.log('console do update2', updateItens)
    if (car.year) {
      const val = await validationPlate(car.year)
      if (val === undefined) {
        updateItens.year = car.year
      } else {
        return { error: val }
      }
    }
    console.log('console do update3', updateItens)
    if (car.plate) {
      const val = await validationYear(car.plate)
      if (val === undefined) {
        updateItens.plate = car.plate
      } else {
        return { error: val }
      }
    }
    console.log('console do update4', updateItens)
    const board = await app.db('cars')
      .where({ plate: car.plate })
    if (board.length > 0) {
      return { error: 'car already registered' }
    }
    if (result.length > 0 && board.length === 0) {
      await app.db('cars')
        .where({ id: id.id })
        .update(updateItens)
      return {}
    }
  }

  return { find, count, findId, save, update }
}
