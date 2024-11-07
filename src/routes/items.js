module.exports = (app) => {
  const put = (req, res) => {
    app.services.item.update(req.params.id, req.body)
      .then((updateItem) => {
        res.status(200).json(updateItem)
      })
  }

  return { put }
}
