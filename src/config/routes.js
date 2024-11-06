module.exports = (app) => {
  app.route('/cars')
    .get(app.routes.cars.find)
    .post(app.routes.cars.create)
}
