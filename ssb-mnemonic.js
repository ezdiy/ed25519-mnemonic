var M = require('./ed25519-mnemonic')
var fs = require('fs')
var chloride = require('chloride')

function home() {
  return process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
}

var dict = new M.Dict(fs.readFileSync("wordlist8k.txt").toString().split("\n").filter(function(x) { return x.length > 0 }))

if (!process.argv[2]) {
  var priv = new Buffer(JSON.parse(fs.readFileSync(home() + '/.ssb/secret')).private, 'base64')
  console.log("Secret phrase is: ")
  console.log(M.private_to_mnemonic(priv, dict).join(' '))
} else {
  var phrase = process.argv[2].split(' ')
  var seed = M.mnemonic_to_seed(phrase, dict)
  if (!seed) {
    console.log('incorrect mnemonic')
    return
  }
  var res = chloride.crypto_sign_seed_keypair(new Buffer(seed))
  var pk = res.publicKey.toString('base64')
  var sk = res.secretKey.toString('base64')
  console.log(JSON.stringify({curve:'ed25519',public: pk, private: sk+'.ed25519', id: '@' + pk}, null, 2))
}


