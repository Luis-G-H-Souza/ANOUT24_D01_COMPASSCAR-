module.exports = (app) => {
  app.route('/api/v1/cars')
    .get(app.routes.cars.find)
    .post(app.routes.cars.create)

  app.route('/api/v1/cars/:id')
    .get(app.routes.cars.getId)

  app.route('/api/v1/cars/:id/items')
    .put(app.routes.items.put)
}
