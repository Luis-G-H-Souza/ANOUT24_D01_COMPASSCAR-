module.exports = (app) => {
  const find = () => {
    return app.db('cars').select('*')
  }

  const findId = (filter = {}) => {
    return app.db('cars').where(filter).first()
  }

  const save = async (car) => {
    const result = await app.db('cars').insert(car)
    const newCarId = result[0]
    const newCar = await app.db('cars').where({ id: newCarId }).first()
    console.log(newCar)
    return newCar
  }

  return { find, findId, save }
}
