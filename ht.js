'use strict'

const crypto = require('crypto')
const multihashing = require('multihashing')
// do not use cryptographic hash functions with ht/rht/hamt
// use non-cryptographic fast hashes, like murmur3 or xxhash

const nextPowerOf2For = (n) => {
  return Math.ceil(Math.log2(n))
}

// hashBucket selects of a bucket for a given hash.
// it uses a prefix of the hash that's big enough
// to cover all the buckets.
//
// TODO: verify this is ok to do and does not skew
// the distribution.
const hashBucket = (hash, size) => {
  const pow = nextPowerOf2For(size)
  const bytes = Math.ceil(pow / 8)
  const val = hash.readUIntLE(0, bytes)
  return val % size
}

// HashTable is a single element hash table, and meant to be
// used to construct recursive hash tables.
//
// The HashTable has the following parameters:
// - seed: a random seed fed into the hashing function.
//         this is useful in recursive constructions.
// - size: the number of buckets in the HashTable
// - hash: the hash function to use. from multihash.
//
// TODO: consider if having a list of values per bkt adds perf
//       over recursive constructions
class HashTable {

  constructor(seed, size, hash) {
    this.seed = HashTable.validateSeed(seed)
    this.size = HashTable.validateSize(size)
    this.hash = HashTable.validateHash(hash)
    this.bkts = {}
  }

  // hashFor returns this HashTable's hash of a given input
  hashFor(name) {
    if (!Buffer.isBuffer(name))
      name = new Buffer(name)

    name = Buffer.concat([this.seed, name])
    return multihashing.digest(name, this.hash)
  }

  // bucketFor selects a bucket index for a given input
  bucketFor(name) {
    return hashBucket(this.hashFor(name), this.size)
  }

  // set overrides the value of the bucket
  set(name, value) {
    this.bkts[this.bucketFor(name)] = value
  }

  // get returns the value of the bucket for the given name.
  get(name) {
    return this.bkts[this.bucketFor(name)]
  }

  // remove deletes the value of a current bucket
  remove(name) {
    delete this.bkts[this.bucketFor(name)]
  }
}


// Default Parameters
HashTable.defaultSize = 1600 // 1600 * 40 bytes = 64KB
HashTable.defaultHash = 'sha1' // default to xxhash
HashTable.defaultSeed = () => { return crypto.pseudoRandomBytes(16) }

HashTable.validateSeed = (seed) => {
  if (typeof(seed) === 'undefined')
    return HashTable.defaultSeed()
  if (!Buffer.isBuffer(seed))
    throw new Error('seed must be a Buffer or undefined (default: random)')
  return seed
}

HashTable.validateSize = (size) => {
  if (typeof(size) === 'undefined')
    return HashTable.defaultSize
  if (typeof(size) !== 'number')
    throw new Error('size must be a number or undefined (default: ' + defaultSize + ')')
  return size
}

HashTable.validateHash = (hash) => {
  if (typeof(hash) === 'undefined')
    return HashTable.defaultHash
  else if (typeof(hash) !== 'string')
    throw new Error('hash must be a string or undefined (default: xxhash)')
  return hash
}

module.exports = HashTable
