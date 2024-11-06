module.exports = (app) => {
  const find = (req, res) => {
    app.services.car.find()
      .then(result => res.status(200).json(result)
      )
  }
  const getId = (req, res) => {
    app.services.car.findId({ id: req.params.id })
      .then(result => res.status(200).json(result))
  }

  const create = async (req, res) => {
    console.log('Dados recebidos:', req.body)
    const result = await app.services.car.save(req.body)
    res.status(201).json(result)
  }
  return { find, getId, create }
}
