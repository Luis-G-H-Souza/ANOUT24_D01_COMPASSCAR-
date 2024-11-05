/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = (knex) => {
  return knex.schema.createTable('cars_items', (t) => {
    t.increments('id').primary()
    t.string('name').notNullable()
    t.integer('car_id').unsigned().notNullable()
    t.timestamp('created_at').defaultTo(knex.fn.now()).notNullable()

    t.foreign('car_id').references('id').inTable('cars')
  })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = (knex) => {
  return knex.schema.dropTable('cars_items')
}
