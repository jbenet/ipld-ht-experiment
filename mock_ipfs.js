const ipld = require('ipld')

const db = {}

db.put = (data) => {
  const m = ipld.marshal(data)
  const k = ipld.multihash(m)
  db[k] = m
  return k
}

db.get = (k) => {
  m = db[k]
  if (!m) {
    throw new Error(k + " not found")
  }
  return ipld.unmarshal(m)
}

module.exports = db
