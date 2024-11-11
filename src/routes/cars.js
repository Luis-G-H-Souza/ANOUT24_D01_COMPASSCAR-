module.exports = (app) => {
  const find = async (req, res) => {
    try {
      let page = parseInt(req.query.page)
      if (!page || page < 1) {
        page = 1
      }
      let limit = parseInt(req.query.limit)

      if (!limit || limit < 1) {
        limit = 5
      } else if (limit > 10) {
        limit = 10
      }
      const yearParams = parseInt(req.query.year)
      const finalPlate = (req.query.final_plate)
      const brand = req.query.brand
      const offset = (page - 1) * limit
      finalPlate.toString()
      const filter = {}
      if (yearParams) filter.year = yearParams
      if (finalPlate) filter.plate = finalPlate
      if (brand) filter.brand = brand
      const car = await app.services.car.find(filter, limit, offset)
      const count = await app.services.car.count(filter)
      res.status(200).json({
        count: count.total,
        pages: Math.ceil(count.total / limit),
        data: car
      })
    } catch (error) {
      res.status(500).json('an internal server error occurred')
    }
  }
  const getId = (req, res) => {
    try {
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
    } catch (error) {
      res.status(500).json('an internal server error occurred')
    }
  }

  const create = async (req, res) => {
    try {
      const result = await app.services.car.save(req.body)

      if (result.Errors && result.Errors.length > 0) {
        for (const i of result.Errors) {
          if (i.error) {
            if (i.error !== 'car already registered') {
              return res.status(400).json(i.error)
            } else {
              return res.status(409).json(i.error)
            }
          }
        }
      }

      if (result.carInser && result.carInser.length > 0) {
        res.status(201).json(result.carInser)
      } else {
        res.status(400).json()
      }
    } catch (error) {
      res.status(500).json('an internal server error occurred')
    }
  }

  const patch = async (req, res) => {
    try {
      const result = await app.services.car.update(req.params, req.body)
      if (result.error) {
        if (result.error === 'car not found') {
          res.status(404).json(result.error)
        } else if (result.error === 'car already registered') {
          res.status(409).json(result.error)
        } else {
          res.status(400).json(result.error)
        }
      }
      res.status(204).end()
    } catch (error) {
      res.status(500).json('an internal server error occurred')
    }
  }

  const out = async (req, res) => {
    try {
      const result = await app.services.car.out(req.params)
      if (result.error) {
        res.status(404).json('car not found')
      } else {
        res.status(204).end()
      }
    } catch (error) {
      res.status(500).json('an internal server error occurred')
    }
  }
  return { find, getId, create, patch, out }
}
