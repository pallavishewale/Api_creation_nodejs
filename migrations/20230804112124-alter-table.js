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
  const sql = 'ALTER TABLE users ADD COLUMN date INTEGER';
  db.runSql(sql, callback);
};

exports.down = function(db,callback) {
  const sql = 'ALTER TABLE users DROP COLUMN age';
  db.runSql(sql, callback);
};

exports._meta = {
  "version": 1
};
