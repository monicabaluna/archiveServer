'use strict'
const express = require('express')
const asyncFs = require('async-file')
const fs = require('fs')
const log = require('bunyan').getLogger('archives')
const sha = require('sha1')
const router = express.Router()
const HttpStatus = require('http-status-codes')
const bearerToken = require('express-bearer-token')

const token = '1234-sunt-praf'

const pathExists = path =>
  new Promise((resolve, reject) => {
    fs.access(path, fs.constants.F_OK, err => {
      if (err !== null && err.code !== 'ENOENT') return reject(err)
      resolve(err === null)
    })
  })

router.use(bearerToken())
router.use(function (req, res, next) {
  if (req.token !== token) res.sendStatus(HttpStatus.UNAUTHORIZED)
  else next()
})

/**
 * @api {get} / Download an archive with stuff to dockerize
 * @apiName Get
 * @apiGroup Archive
 *
 * @apiParam {String} filePath FilePath
 *
 * @apiSuccess {Number} err 0
 * @apiError {String} err Error
 * @apiError {String} statusError error
 */
router.get('/', async function (req, res) {
  try {
    let filePath = `${__dirname}/../files/${req.query.filePath}`
    let valid = await pathExists(filePath)

    if (!valid) {
      res.sendStatus(HttpStatus.BAD_REQUEST)
    } else {
      let fileContents = asyncFs.readFile(filePath)
      let checksum = sha(fileContents)
      log.info(filePath)

      res.set('checksum', checksum)
      await res.download(filePath)
    }
  } catch (err) {
    console.error(err)
  }
})

module.exports.router = router
