import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('meals', (table) => {
    table.uuid('id').primary()
    table.uuid('user_id').index()
    table.string('name').notNullable()
    table.text('description').notNullable()
    table.boolean('diet').notNullable()
    table.datetime('date_time').notNullable()
    table.datetime('created_at').defaultTo(knex.fn.now()).notNullable()
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('meals')
}
