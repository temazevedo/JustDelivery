const { db } = require('./.env')

module.exports = {
  client: 'better-sqlite3',
  connection: db,
  pool: {
    min: 2,
    max: 10
  },
  migrations: {
    tableName: 'knex_migrations'
  }
}