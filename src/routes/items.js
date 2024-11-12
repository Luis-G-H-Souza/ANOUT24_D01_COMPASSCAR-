module.exports = (app) => {
  const put = (req, res) => {
    try {
      app.services.item.update(req.params.id, req.body)
        .then((updateItem) => {
          if (updateItem) {
            if (updateItem.error.includes('car not found')) {
              return res.status(404).json(updateItem)
            } else if (updateItem.error) {
              return res.status(400).json(updateItem)
            }
          } else if (updateItem === undefined) {
            res.status(204).end()
          }
        })
    } catch (error) {
      res.status(500).json({ errors: ['an internal server error occurred'] })
    }
  }

  return { put }
}
