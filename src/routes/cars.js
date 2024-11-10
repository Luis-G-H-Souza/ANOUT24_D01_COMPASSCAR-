module.exports = (app) => {
  const find = (req, res) => {
    app.services.car.find()
      .then(result => res.status(200).json(result)
      )
  }
  const getId = (req, res) => {
    app.services.car.findId([{ id: req.params.id }])
      .then(result => {
        if (Array.isArray(result)) {
          for (const i of result) {
            if (i.error) {
              res.status(404).json(i.error)
            } else {
              res.status(200).json(i)
            }
          }
        } else {
          if (result.error) {
            res.status(404).json(result.error)
          }
          res.status(200).json(result)
        }
      })
  }

  const create = async (req, res) => {
    const result = await app.services.car.save(req.body)
    if (Array.isArray(result.Errors)) {
      for (const i of result.Errors) {
        if (i.error) {
          if (i.error !== 'car already registered') {
            return res.status(400).json(i)
          } else {
            return res.status(409).json(i)
          }
        }
        res.status(201).json(i)
      }
    } else {
      if (result.Errors !== 'car already registered') {
        return res.status(400).json(result)
      } else {
        return res.status(409).json(result)
      }
    }
    if (Array.isArray(result.carInser)) {
      for (const i of result.carInser) {
        res.status(201).json(i)
      }
    } else {
      res.status(201).json(result.carInser)
    }
  }

  return { find, getId, create }
}
