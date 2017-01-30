
exports.up = function(knex, Promise) {
  return knex.schema.createTable('games', function(table){
    table.increments('id').primary();
    table.timestamp('dtcreated').defaultTo(knex.fn.now());
    table.text('title').notNullable();
    table.text('cover').notNullable();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('games');
};
