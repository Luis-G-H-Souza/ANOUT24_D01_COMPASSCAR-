module.exports = (app) => {
  const { validation, validationPlate, validationYear } = require('../validations/validationcar')

  const find = async (filter = {}, limit, offset) => {
    return await app.db('cars')
      .limit(limit)
      .offset(offset)
      .modify(queryBuilder => {
        if (filter.year) {
          queryBuilder.where('year', '>=', filter.year)
        }
        if (filter.plate) {
          queryBuilder.whereRaw('RIGHT(CAST(plate AS CHAR), 1) = ?', [filter.plate.toString()])
        }
        if (filter.brand) {
          queryBuilder.where('brand', 'LIKE', `%${filter.brand}%`)
        }
      })
      .select('*')
  }
  const count = async (filter = {}) => {
    const query = app.db('cars')
    if (filter.year) {
      query.where('year', '>=', filter.year)
    }
    if (filter.plate) {
      query.whereRaw('RIGHT(CAST(plate AS CHAR), 1) = ?', [filter.plate.toString()])
    }
    if (filter.brand) {
      query.whereRaw('RIGHT(CAST(plate AS CHAR), 1) = ?', [filter.plate])
    }
    const result = await query.count('id as total').first()
    return result
  }

  const findId = async (car, filter = {}) => {
    const err = []
    const idCar = []
    for (const i of car) {
      const carExist = await app.db('cars')
        .where({ id: i.id })
        .first()
      if (!carExist) {
        err.push({ error: ['car not found'] })
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
      const erro = validation(car)
      if (erro.length > 0) {
        Errors.push({ error: [erro.join(', ')] })
      } else {
        const carExists = await app.db('cars').where({ plate: car.plate }).first()
        if (carExists) {
          Errors.push('car already registered')
        }
      }
      if (Errors.length > 0) {
        return { errors: Errors }
      }

      const result = await app.db('cars').insert(car)
      const newCarId = result[0]
      const newCar = await app.db('cars').where({ id: newCarId }).first()
      return ({ newCar, errors: [] })
    } catch (error) {

    }
    // throw error
  }

  const update = async (id, car) => {
    const result = await app.db('cars')
      .where({ id: id.id })
    if (result.length === 0) {
      return { error: ['car not found'] }
    }
    const updateItens = {}
    if (car.brand) {
      if (!car.model) {
        return { error: ['model must also be informed'] }
      }
      updateItens.brand = car.brand
    }

    if (car.model) updateItens.model = car.model
    if (car.year) {
      const val = await validationYear(car.year)

      if (val === undefined) {
        updateItens.year = car.year
      } else {
        return { error: [val] }
      }
    }

    if (car.plate) {
      const val = await validationPlate(car.plate)
      if (val === undefined) {
        updateItens.plate = car.plate
      } else {
        return { error: [val] }
      }
    }
    let board = []
    if (car.plate) {
      board = await app.db('cars')
        .where({ plate: car.plate })
      if (board.length > 0) {
        return { error: ['car already registered'] }
      }
    }

    if (result.length > 0 && board.length === 0) {
      await app.db('cars')
        .where({ id: id.id })
        .update(updateItens)
      return {}
    }
  }
  const out = async (id) => {
    const carExist = await app.db('cars')
      .where({ id: id.id })
      .first()
    if (!carExist) {
      return { error: ['car not found'] }
    }
    const itemExist = await app.db('cars_items').where({ car_id: id.id })
    if (itemExist.length > 0) {
      await app.db('cars_items').where({ car_id: id.id }).delete()
    }
    await app.db('cars').where({ id: id.id }).delete()
    return {}
  }

  return { find, count, findId, save, update, out }
}
