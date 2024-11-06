module.exports = (app) => {
  const find = (req, res) => {
    app.db('cars').select()
      .then(result => res.status(200).json(result)
      )
  }

  const create = async (req, res) => {
    console.log('Dados recebidos:', req.body)
    const result = await app.db('cars').insert(req.body)
    const newCarId = result[0]
    const newCar = await app.db('cars').where({ id: newCarId }).first()
    res.status(201).json(newCar)
  }
  return { find, create }
}
