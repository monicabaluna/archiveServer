var express = require('express')
var http = require('http')
var log = require('./logger.js')('debug').getLogger('server')
var bodyParser = require('body-parser')
var archivesRouter = require('./routers/archives.js')

var port = process.env.PORT || 3001
var app = express()

var server = http.createServer(app)

var apiv1 = express.Router()
apiv1.use(bodyParser.json())
apiv1.use('/archives', archivesRouter.router)

// api v1
app.use('/api/v1', apiv1)

app.use(function (err, req, res, next) {
  next
  log.error(err, 'Error')
  error.sendError(res, error.serverError(err))
})

server.listen(port, function (err) {
  if (err) {
    log.error('Server ' + err)
  } else {
    log.info('Server start port ' + port)
  }
})
