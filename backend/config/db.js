const config = require('../knexfile.js')
const knex = require('knex')(config)


knex.migrate.latest([config]) // update migrations automaticaly

module.exports = knex