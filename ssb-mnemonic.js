var mnemonic = require('./ed25519-mnemonic')
var usenames = (
  'bac bad baf bam bec bed bef bem bic bid bif bim boc bod bof bom ' +
  'gac gad gaf gam gec ged gef gem gic gid gif gim goc god gof gom ' +
  'hac had haf ham hec hed hef hem hic hid hif him hoc hod hof hom ' +
  'jac jad jaf jam jec jed jef jem jic jid jif jim joc jod jof jom ' +
  'kac kad kaf kam kec ked kef kem kic kid kif kim koc kod kof kom ' +
  'lac lad laf lam lec led lef lem lic lid lif lim loc lod lof lom ' +
  'nac nad naf nam nec ned nef nem nic nid nif nim noc nod nof nom ' +
  'pac pad paf pam pec ped pef pem pic pid pif pim poc pod pof pom ' +
  'qac qad qaf qam qec qed qef qem qic qid qif qim qoc qod qof qom ' +
  'rac rad raf ram rec red ref rem ric rid rif rim roc rod rof rom ' +
  'sac sad saf sam sec sed sef sem sic sid sif sim soc sod sof som ' +
  'tac tad taf tam tec ted tef tem tic tid tif tim toc tod tof tom ' +
  'vac vad vaf vam vec ved vef vem vic vid vif vim voc vod vof vom ' +
  'wac wad waf wam wec wed wef wem wic wid wif wim woc wod wof wom ' +
  'yac yad yaf yam yec yed yef yem yic yid yif yim yoc yod yof yom ' +
  'zac zad zaf zam zec zed zef zem zic zid zif zim zoc zod zof zom'
).split(' ').map(function(x) {return x[0].toUpperCase() + x.slice(1) })

try { var P = require('proquint') } catch(e) {}
var fs = require('fs')
var chloride = require('chloride')

function home() {
  return process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
}

var dict = new mnemonic.Dict(fs.readFileSync("wordlist8k.txt").toString().split("\n").filter(function(x) { return x.length > 0 }))

if (!process.argv[2]) {
  var priv = new Buffer(JSON.parse(fs.readFileSync(home() + '/.ssb/secret').toString().replace(/^#.*/mg,'')).private, 'base64').slice(0,32)
  console.log("Key found in ~/.ssb/secret")
  if (P) {
    console.log("\nThe secret proquint is: ")
    console.log(P.encode(priv))
  }
  console.log("\nThe secret use name: ")
  console.log(Array.prototype.map.call(priv, function(x) { return usenames[x] }).join(''))
  console.log("\nThe secret mnemonic is: ")
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


