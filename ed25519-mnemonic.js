function shr256(x, n)
{
   var carry = 0, mask = (1<<n)-1
   for (i = 8; i >= 0; i--) {
      var newcarry = (x[i] & mask) << (32 - n)
      x[i] = carry | (x[i] >>> n)
      carry = newcarry
   }
}

function shl256(x, n)
{
   var carry = 0, mask = ((1<<n)-1) << (32 - n)
   for (i = 0; i < 9; i++) {
      var newcarry = (x[i] & mask) >>> (32 - n)
      x[i] = carry | (x[i] << n)
      carry = newcarry
   }
}

exports.Dict = function (dict)
{
  var bits = Math.log2(dict.length)
  var mask = dict.length-1
  var nword = (Math.floor(256 / bits) + 1)

  if ((1<<bits) !== dict.length)
    throw new Error("dict must be exactly power of 2 words, got " + dict.length)

  this.bits = bits;
  this.mask = mask;
  this.nword = nword;
  this.checkbits = nword*bits - 256
  this.checkmask = (1<<this.checkbits)-1
  this.words = dict
  return this
}

exports.private_to_mnemonic = function(sk, dict)
{
  var sk = sk.slice(0, 32)
  var i, t = [];
  var sum = 5381;
  // endian
  var dv = new DataView(new Uint8Array(sk).buffer)
  for (i = 0; i < 8; i++) {
    var v = dv.getInt32(i * 4, true)
    sum = ((sum<<dict.checkbits)+sum+v)|0
    t.push(v);
  }
  t.push(0)

  shl256(t, dict.checkbits)
  t[0] |= sum & dict.checkmask

  var phrase = []
  for (i = 0; i < dict.nword; i++) {
    var idx = t[0] & dict.mask
    var word = dict.words[idx]
    phrase.push(word)
    shr256(t, dict.bits);
  }
  return phrase;
}

exports.mnemonic_to_seed = function(phrase, dict)
{
  if (phrase.length != dict.nword)
    throw new Error("phrase must be exactly " + dict.nword + " words")
  var i, t = new Uint32Array(9)
  for (i = dict.nword-1; i >= 0; i--) {
    var idx = dict.words.indexOf(phrase[i])
    if (idx < 0) return null
    shl256(t, dict.bits)
    t[0] |= idx
  }
  var sum = 5381, sum2 = t[0] & dict.checkmask
  shr256(t, dict.checkbits)
  var dv = new DataView(t.buffer)
  for (i = 0; i < 8; i++) {
    var v = dv.getInt32(i * 4, true)
    sum = ((sum<<dict.checkbits)+sum+v)|0
    t[i] = v
  }
  if ((sum & dict.checkmask) != sum2) return null
  return t.slice(0,8).buffer
}


