'use strict'

const HT = require('./ht')
const multihashing = require('multihashing')

// RecursiveHashTable is a hierarchy of nested hash tables.
// The RecursiveHashTable is composed of HashTable nodes.
//
// It has the following parameters:
// - fanout: the number of buckets in each HashTable node.
// - hash: the hash function to use. from multihash.
//
// TODO: this seems to be just a stupid reinvention of
// of HAMT without the really nice properties and proofs.
// Maybe we should just use HAMT isntead of this.

class RecursiveHashTable {

  constructor(fanout, hash) {
    // fanout is the bucket size of each child HashTable.
    this.fanout = HT.validateSize(fanout)

    // hash is the hash function to use. same param as HashTable.
    this.hash = HT.validateHash(hash)

    // in memory array of HT nodes.
    // will want to "page these in and out of ipfs"
    this.nodes = {}
    this.nodes['/'] = this.root
  }

  hashFn(val) {
    return multihashing.digest(val, this.hash)
  }

  // construct a new HashTable with a given seed.
  newHT(seed) {
    return new HT(this.hashFn(seed), this.fanout, this.hash)
  }

  // get HT for a path. may load it from IPFS, or may be cached.
  getHT(path) {
    // load HT from IPFS.
    //
    // not clear whether RecursiveHashTable should keep a pointer to
    // an IPFS node instance, or whether it should be an argument to
    // the functions.
    throw new Error("not implemented yet")
  }

  // store in memory HT node at a given path, back into IPFS.
  // and bubble up all the way to root. (like mfs)
  writeHT(path) {
    // IMPORTANT
    // will want to coalesce writing to IPFS during graph building,
    // to avoid unnecessary I/O for intermediate node states.
    throw new Error("not implemented yet")
  }

  // set adds the value to the hashtable, potentially growing the structure
  set(name, value) {
    // will probably have to store the value along with the name
    // for exact matching, so wrap the value.
    // entry = {n: name, v: value, }

    /* rough insertion algorithm.
    WARNING: has not been verified!! this is rough pseudocode.
    WARNING: should probably just use a HAMT instead of this...

    // get root table
    var ht = this.getHT('/')
    var path = '/'
    var entry

    while (true) {
      entry = ht.get(name)

      if (entry === undefined) { // if spot is empty, write into it
        entry = {n: name, v: value}
        break // found empty spot. write here.
      }

      if (!isLeaf(entry)) { // if not a leaf, recurse.
        ht = this.getHT(path)
        continue
      }

      if (entry.n === name) { // if same exact name, replace.
        entry.v = value
        break // occupied spot, but should be replaced.
      }

      // ok, not empty, and a leaf, with different name.
      // we need to place a new HT here, and insert both
      // leaves into it.

      // update path with the bucket integer.
      // so paths will look like: /14/52/1
      path += '/' + ht.bucketFor(name)
      if (path.substr(0, 2) === '//') {
        path = path.substr(1) // remove double first slash.
      }

      // create a new bucket and insert entry into it
      new_ht = this.newHT(path) // use path as seed
      new_ht.set(entry.n, entry)
      ht.set(name, new_ht) // set new_ht as current val in ht.
      // ht.writeHT(path) // optimization: dont need to write here, as will write it when child bubbles up.

      // recurse.
      ht = new_ht
    }

    // ok now we can insert new value.
    // use "entry" as it may be pointing to existing, in place memory
    entry.n = name // make sure
    entry.v = value // make sure.
    ht.set(name, entry)
    this.writeHT(path)
    */

    throw new Error("not implemented yet")
  }

  // get returns the value for the given name.
  get(name) {
    throw new Error("not implemented yet")
  }

  // remove deletes the value of a current bucket
  remove(name) {
    throw new Error("not implemented yet")
  }
}

module.exports = RecursiveHashTable
