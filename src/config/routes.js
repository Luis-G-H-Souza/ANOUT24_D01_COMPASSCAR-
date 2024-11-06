module.exports = (app) => {
  app.route('/cars')
    .get(app.routes.cars.find)
    .post(app.routes.cars.create)

  app.route('/cars/:id')
    .get(app.routes.cars.getId)
}
