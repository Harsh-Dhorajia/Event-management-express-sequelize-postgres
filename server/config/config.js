require('dotenv').config();

const env = process.env.NODE_ENV || 'development';
const username = process.env.POSTGRES_USERNAME;
const password = process.env.POSTGRES_PASSWORD;
const database = process.env.POSTGRES_DATABASE;
const host = process.env.POSTGRES_HOST;
const port = process.env.POSTGRES_PORT;
const dialect = 'postgres';

module.exports = {
  [env]: {
    dialect,
    username,
    password,
    database,
    host,
    port,
    logging: false,
    migrationStorageTableName: '_migrations',
  },
};
