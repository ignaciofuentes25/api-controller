const { autoCommit, outFormat } = require("oracledb");
var objoracle = require("oracledb");

//objoracle.initOracleClient({ libDir: "C:\\instantclient_21_3" });

const cns = {
  user: process.env.DB_USR,
  password: process.env.DB_PWD,
  connectString: process.env.DB_CONNSTR,
};

function error(err: any, rs: any, cn: any) {
  if (err) {
    console.log(err.message);
    rs.contentType("application/json").status(500);
    rs.send(err.message);
    if (cn != null) close(cn);
    return -1;
  } else {
    return 0;
  }
}
function open(sql: any, binds: any, dml: any, rs: any) {
  objoracle.getConnection(cns, (err: any, cn: any) => {
    if (error(err, rs, null) == -1) return;
    cn.execute(
      sql,
      binds,
      { autoCommit: dml, outFormat: objoracle.OUT_FORMAT_OBJECT },
      (err: any, result: any) => {
        console.log(result);
        if (error(err, rs, cn) == -1) return;
        rs.contentType("application/json").status(200);
        if (dml) {
          rs.send(JSON.stringify(result.rowsAffected));
        } else {
          console.log(result);
          rs.send(JSON.stringify(result.rows));
        }
        close(cn);
      }
    );
  });
}
function close(cn: any) {
  cn.release((err: any) => {
    if (err) {
      console.error(err.message);
    }
  });
}

exports.open = open;
exports.close = close;
