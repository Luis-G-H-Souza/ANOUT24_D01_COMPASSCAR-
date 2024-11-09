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
    const result = await app.services.car.save(req.body)
    if (result.error) {
      console.log(result.error)
      if (result.error !== 'car already registered') {
        return res.status(400).json(result)
      } else {
        return res.status(409).json(result)
      }
    }
    res.status(201).json(result)
  }
  return { find, getId, create }
}
