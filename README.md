Usage:

```
ezdiy@kepl:~/ed25519-mnemonic$ cat ~/.ssb/secret ;echo
# this is your SECRET name.
# this name gives you magical powers.
# with it you can mark your messages so that your friends can verify
# that they really did come from you.
#
# if any one learns this name, they can use it to destroy your identity
# NEVER show this to anyone!!!

{
  "curve": "ed25519",
  "public": "sl7amFLuqex4izXgY/DYUcIEzOx+kVe4qBgeTNSiz3o=.ed25519",
  "private": "icJFrJYnNI660x8kw+oXyzYUJB9ea2YhoITYLsWc2CCyXtqYUu6p7HiLNeBj8NhRwgTM7H6RV7ioGB5M1KLPeg==.ed25519",
  "id": "@sl7amFLuqex4izXgY/DYUcIEzOx+kVe4qBgeTNSiz3o=.ed25519"
}

# WARNING! It's vital that you DO NOT edit OR share your secret name
# instead, share your public name
# your public name: @sl7amFLuqex4izXgY/DYUcIEzOx+kVe4qBgeTNSiz3o=.ed25519
ezdiy@kepl:~/ed25519-mnemonic$ node ssb-mnemonic.js
Key found in ~/.ssb/secret, the mnemonic is:
fin clever lome float fungi yeast tragedy prank balanced atoll eden slave panty whips unite secret bat masks brunt llama
ezdiy@kepl:~/ed25519-mnemonic$ node ssb-mnemonic.js 'fin clever lome float fungi yeast tragedy prank balanced atoll eden slave panty whips unite secret bat masks brunt llama'
Reconstructed key from supplied mnemonic:
{
  "curve": "ed25519",
  "public": "sl7amFLuqex4izXgY/DYUcIEzOx+kVe4qBgeTNSiz3o=.ed25519",
  "private": "icJFrJYnNI660x8kw+oXyzYUJB9ea2YhoITYLsWc2CCyXtqYUu6p7HiLNeBj8NhRwgTM7H6RV7ioGB5M1KLPeg==.ed25519",
  "id": "@sl7amFLuqex4izXgY/DYUcIEzOx+kVe4qBgeTNSiz3o=.ed25519"
}
```
