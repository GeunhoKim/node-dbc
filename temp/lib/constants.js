const dbmsEnums = Object.freeze(
  {
    MSSQL: 0,
    ORACLE: 1,
    MARIADB: 2
  }
);

const dbmsStrs = Object.freeze(
  {
    MSSQL: 'MSSQL',
    ORACLE: 'ORACLE',
    MARIA: 'MARIADB'
  }
);

// -------------------------------------------------
// constants
const constants = {
  dbmsEnums: dbmsEnums,
  dbmsStrs: dbmsStrs,

  GetDbmsEnum: getDbmsEnum
};

/**
 *
 * @param DBMS String
 * @returns DBMS Enum
 */
function getDbmsEnum(dbmsStr) {
  var target = dbmsStr.toUpperCase();

  for (var idx in dbmsStrs) {
    if (target == dbmsStrs[idx])
      return dbmsEnums[idx];
  }

  return null;
}

module.exports = constants;