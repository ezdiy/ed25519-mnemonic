var mnemonic = require('./ed25519-mnemonic')
try { var P = require('proquint') } catch(e) {}
var fs = require('fs')
var chloride = require('chloride')

function home() {
  return process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
}

var dict = new mnemonic.Dict(fs.readFileSync("wordlist8k.txt").toString().split("\n").filter(function(x) { return x.length > 0 }))

if (!process.argv[2]) {
  var priv = new Buffer(JSON.parse(fs.readFileSync(home() + '/.ssb/secret').toString().replace(/^#.*/mg,'')).private, 'base64')
  console.log("Key found in ~/.ssb/secret")
  if (P) {
    console.log("\nThe proquint is: ")
    console.log(P.encode(priv.slice(0,32)))
  }
  console.log("\nThe mnemonic is: ")
  console.log(mnemonic.private_to_mnemonic(priv, dict).join(' '))
} else {
  var seed, phrase = process.argv[2]
  phrase = phrase.split(' ')
  if (phrase.length === 1) {
    if (phrase[0].length !== 95)
      throw new Error("your chant is wrong")
    seed = P.decode(phrase[0])
  } else {
    seed = mnemonic.mnemonic_to_seed(phrase, dict)
    if (!seed)
      throw new Error('incorrect mnemonic')
  }
  console.log("Reconstructed key from supplied chant/mnemonic: ")
  var res = chloride.crypto_sign_seed_keypair(new Buffer(seed))
  var pk = res.publicKey.toString('base64')
  var sk = res.secretKey.toString('base64')
  console.log(JSON.stringify({curve:'ed25519',public: pk+'.ed25519', private: sk+'.ed25519', id: '@' + pk + '.ed25519'}, null, 2))
}


