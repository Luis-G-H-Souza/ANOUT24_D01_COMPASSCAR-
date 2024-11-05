const app = require('express')()
const consign = require('consign')

consign({ cwd: 'src', verbose: false })
  .include('./config/middleware.js')
  .into(app)

app.get('/', (req, res) => {
  res.status(200).send()
})

module.exports = app
