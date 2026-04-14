/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('saved_routes', table => {
    table.increments('id').primary()
    table.string('clientsId_array').notNullable()
    table.string('route').notNullable()
    table.datetime('date')
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('saved_routes')
};
