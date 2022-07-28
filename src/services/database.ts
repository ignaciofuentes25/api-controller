const oracledb = require("oracledb");
const dbConfig = require("./dbconfig");
const defaultThreadPoolSize = 4;

async function initialize() {
  // Increase thread pool size by poolMax
  process.env.UV_THREADPOOL_SIZE =
    dbConfig.hrPool.poolMax + defaultThreadPoolSize;

  await oracledb.createPool(dbConfig.hrPool);
}

module.exports.initialize = initialize;

async function close() {
  await oracledb.getPool().close();
}

module.exports.close = close;

function simpleExecute(statement: string, binds = [], opts: any = {}) {
  return new Promise(async (resolve, reject) => {
    let conn;

    opts.outFormat = oracledb.OBJECT;
    opts.autoCommit = true;

    oracledb.fetchAsString = [oracledb.CLOB];

    try {
      conn = await oracledb.getConnection();

      const result = await conn.execute(statement, binds, opts);

      resolve(result);
    } catch (err) {
      reject(err);
    } finally {
      if (conn) {
        // conn assignment worked, need to close
        try {
          await conn.close();
        } catch (err) {
          console.log(err);
        }
      }
    }
  });
}

module.exports.simpleExecute = simpleExecute;

function multipleExecute(statement: string, binds = [], opts: any = {}) {
  return new Promise(async (resolve, reject) => {
    let conn;

    opts.outFormat = oracledb.OBJECT;
    opts.autoCommit = true;

    oracledb.fetchAsString = [oracledb.CLOB];

    try {
      conn = await oracledb.getConnection();

      const result = await conn.executeMany(statement, binds, opts);

      resolve(result);
    } catch (err) {
      reject(err);
    } finally {
      if (conn) {
        // conn assignment worked, need to close
        try {
          await conn.close();
        } catch (err) {
          console.log(err);
        }
      }
    }
  });
}

module.exports.multipleExecute = multipleExecute;
