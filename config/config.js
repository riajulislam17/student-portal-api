require('dotenv').config();
require("ts-node/register/transpile-only");
const { buildDatabaseConfig } = require("../src/common/database/database.config");

const db = buildDatabaseConfig();
module.exports = {
  development: db,
  production: db,
  test: db,
};
