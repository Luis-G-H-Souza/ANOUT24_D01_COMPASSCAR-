/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = (knex) => {
  return knex.schema.createTable('cars', (t) => {
    t.increments('id').primary()
    t.string('brand').notNullable()
    t.string('model').notNullable()
    t.string('plate').notNullable().unique()
    t.integer('year').notNullable()
    t.timestamp('created_at').defaultTo(knex.fn.now()).notNullable()
  })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = (knex) => {
  return knex.schema.dropTable('cars')
}
