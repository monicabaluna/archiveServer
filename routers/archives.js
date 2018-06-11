'use strict'
var express = require('express')
var formidable = require('formidable')
var fs = require('fs')
var asyncFs = require('async-file')
var util = require('util')
var log = require('bunyan').getLogger('archives')
var md5 = require('md5')
var router = express.Router()
var tokens = {}

/**
 * @api {post} / Send an archive with stuff to dockerize
 * @apiName Post
 * @apiGroup User
 *
 * @apiParam {String} username Username
 *
 * @apiSuccess {Number} err 0
 * @apiError {String} err Error
 * @apiError {String} statusError error
 */
router.post('/', async function (req, res) {
  const uploadDir = 'files/'
  var form = new formidable.IncomingForm({ uploadDir: uploadDir })
  form.parse(req, async function (err, fields, files) {
    try {
      let token = fields.token
      let filePath = files.filetoupload.path
      tokens[filePath] = token

      log.info(`Upload zip to ${filePath}`)
      res.send(util.inspect({ fields: fields, files: files }))
    } catch (err) {
      throw err
    }
  })
})

router.get('/', async function ({ body: { filePath, token } }, res) {
  if (tokens[filePath] === token) {
    console.log('ok')
  } else {
    console.log('not ok')
  }
  res.sendStatus(HttpStatus.OK)
})

module.exports.router = router
