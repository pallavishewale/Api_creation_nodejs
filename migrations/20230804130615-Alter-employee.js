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
  const sql = 'ALTER TABLE employee ADD COLUMN HRA FLOAT,ADD COLUMN TA INTEGER,ADD COLUMN DA FLOAT,ADD COLUMN gross_salary INTEGER';
  db.runSql(sql, callback);
};

exports.down = function(db,callback) {
  const sql = 'ALTER TABLE employee DROP COLUMN HRA,DA,TA,gross_salary';
  db.runSql(sql, callback);
};

exports._meta = {
  "version": 1
};
