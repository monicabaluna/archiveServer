const request = require('request-promise')
const asyncFs = require('async-file')

async function main () {
  try {
    let credentials = JSON.parse(
      await asyncFs.readFile('credentials.json', 'utf8')
    )

    let jsonbody = {
      clientToken: '1234',
      registryUsername: credentials.username,
      registryPassword: credentials.password,
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
        break
      case 'zip':
        jsonbody.sourceType = 'zip'
        jsonbody.downloadAddress =
          'http://localhost:3001/api/v1/archives?filePath=boop.zip'
        break
      default:
        throw Error('unspecified source type')
    }

    let options = {
      method: 'POST',
      uri: 'http://localhost:3000/api/v1/containers/build',
      body: jsonbody,
      json: true
    }

    response = await request(options)
    console.log(response)
  } catch (err) {
    console.error(err)
  }
}

main().catch(err => console.error(err))
