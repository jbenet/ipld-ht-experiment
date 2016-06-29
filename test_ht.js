'use strict'

const HT = require('./ht')
const ht = new HT()

for (var i = 0; i < 100; i++) {
  ht.set("key" + i, i)
}

console.log(ht)
