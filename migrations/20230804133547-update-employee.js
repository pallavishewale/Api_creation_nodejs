'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db,callback) {
  const sql = `
  UPDATE employee 
  SET hra = 0.3 * salary,
      ta = 5000,
      da = 0.1 * salary,
      gross_salary = salary + 0.3 * salary + 5000 + 0.1 * salary;
`;
db.runSql(sql, callback);
};

exports.down = function(db) {
  return null;
};

exports._meta = {
  "version": 1
};
