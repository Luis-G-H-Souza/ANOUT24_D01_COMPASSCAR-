module.exports = (app) => {
  const put = (req, res) => {
    app.services.item.update(req.params.id, req.body)
      .then((updateItem) => {
        if (updateItem) {
          if (updateItem.error === 'car not found') {
            return res.status(404).json(updateItem.error)
          } else if (updateItem.error) {
            return res.status(400).json(updateItem.error)
          }
        }
        res.status(204).json(updateItem)
      })
  }

  return { put }
}
