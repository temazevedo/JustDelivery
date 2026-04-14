/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('clients', table => {
    table.increments('id').primary()
    table.string('name').notNullable()
    table.string('address').notNullable()
    table.string('apartment')
    table.string('city').notNullable()
    table.string('gpsLat').notNullable()
    table.string('gpsLng').notNullable()
    table.string('phone').notNullable()
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('clients')
};
