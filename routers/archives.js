'use strict'
const express = require('express')
const formidable = require('formidable')
const fs = require('fs')
const asyncFs = require('async-file')
const util = require('util')
const log = require('bunyan').getLogger('archives')
const md5 = require('md5')
const router = express.Router()
const HttpStatus = require('http-status-codes')
let tokens = {}

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
  let form = new formidable.IncomingForm({ uploadDir: uploadDir })
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

router.get('/', async function (req, res) {
  let filePath = req.query.filePath
  let token = req.query.token

  if (tokens[filePath] === token) {
    console.log('ok')
  } else {
    console.log('not ok')
  }
  res.sendStatus(HttpStatus.OK)
})

module.exports.router = router
