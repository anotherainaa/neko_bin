const { db } = require("./db-query");

class PgPersistence {
  async createBin(url) {
    const CREATE_BIN = "INSERT INTO bins (url, date_created) VALUES ($1, now());"
    try {
      let result = await db.any(CREATE_BIN, [url]);
      return result.id;
    } catch (err) {
      console.log(`ERROR: ${err}`);
    }
  }

  async findBin(binId) {
    const SELECT_BIN = "SELECT * FROM bins WHERE id = $1"
    try {
      let result = await db.one(SELECT_BIN, [binId]);
      return result;
    } catch (err) {
      console.log(`ERROR: ${err}`);
    }
  }

  async findBinFromURL(url) {
    const SELECT_BIN = "SELECT * FROM bins WHERE url = $1"
    try {
      let result = await db.one(SELECT_BIN, [url]);
      return result;
    } catch (err) {
      console.log(`ERROR: ${err}`);
    }
  }

  async findAllBins() {
    const SELECT_ALL_BINS = "SELECT * FROM bins"
    try {
      let results = await db.any(SELECT_ALL_BINS);
      return results;
    } catch (err) {
      console.log(`ERROR: ${err}`);
    }
  }
}

// Test functions
const pg = new PgPersistence();
const result = pg.findBinFromURL('c76acc28bbb298a6e2427d4a404fc16f367557a7');

result.then(r => console.log(r.id))

module.exports = PgPersistence;
