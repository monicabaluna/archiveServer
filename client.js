const asyncFs = require('async-file')
const io = require('socket.io-client')
const request = require('request-promise')
const uuid = require('uuid/v1')

const uri = 'http://localhost:3000/api/v1/containers/build'
const clientToken = '1234-sunt-praf'

let clientUid = uuid()
let socket = io(uri, { query: { clientUid } })

socket.on('disconnect', function () {
  console.log('build process ended')
  process.exit(0)
})

socket.on('message', function (data) {
  console.log(data)
})

async function main () {
  try {
    let credentials = JSON.parse(
      await asyncFs.readFile('credentials.json', 'utf8')
    )

    let jsonbody = {
      clientUid,
      clientToken,
      registryUsername: credentials.username,
      registryPassword: credentials.password,
      registry: 'docker.io'
    }

    let to_log = {
      clientUid,
      clientToken: '***',
      registryUsername: credentials.username,
      registryPassword: '*****',
      registry: 'docker.io'
    }

    switch (process.argv[2]) {
      case 'git':
        jsonbody.sourceType = 'git'
        jsonbody.downloadAddress =
          'https://github.com/monicabaluna/wyliTheRepo.git'
        jsonbody.gitToken = credentials.gitToken
        jsonbody.gitBranch = 'branch1'
        jsonbody.gitCommitSHA = '4fd86adc8d128f1e070738d901611b73e9708400'

        to_log.sourceType = 'git'
        to_log.downloadAddress =
          'https://github.com/monicabaluna/wyliTheRepo.git'
        to_log.gitToken = credentials.gitToken
        to_log.gitBranch = 'branch1'
        to_log.gitCommitSHA = '4fd86adc8d128f1e070738d901611b73e9708400'
        break
      case 'zip':
        jsonbody.sourceType = 'zip'
        jsonbody.downloadAddress =
          'http://localhost:3001/api/v1/archives?filePath=boop.zip'
        to_log.sourceType = 'zip'
        to_log.downloadAddress =
          'http://localhost:3001/api/v1/archives?filePath=boop.zip'
        break
      default:
        throw Error('unspecified source type')
    }

    let options = {
      method: 'POST',
      uri: uri,
      body: jsonbody,
      json: true
    }

    console.log(to_log)

    response = await request(options)
    console.log('Server response code:', response)
  } catch (err) {
    console.error(err)
  }
}

main().catch(err => console.error(err))
