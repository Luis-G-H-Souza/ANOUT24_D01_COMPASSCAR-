module.exports = (app) => {
  const find = () => {
    return app.db('cars').select()
  }
  const save = async (car) => {
    const result = await app.db('cars').insert(car)
    const newCarId = result[0]
    const newCar = await app.db('cars').where({ id: newCarId }).first()
    return newCar
  }

  return { find, save }
}
