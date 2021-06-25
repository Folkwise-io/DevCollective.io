import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(`posts`, (table) => {
    table.increments(`id`).primary();

    table.integer(`authorId`).notNullable();
    table.integer(`communityId`).notNullable();

    table.text(`title`).notNullable();
    table.text(`body`).notNullable();
    table.timestamp(`createdAt`).notNullable().defaultTo(knex.fn.now());
    table.timestamp(`updatedAt`).notNullable().defaultTo(knex.fn.now());

    // Constraints and indices
    table.foreign(`authorId`).references(`users.id`).onDelete(`CASCADE`);
    table.foreign(`communityId`).references(`communities.id`).onDelete(`CASCADE`);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable(`posts`);
}
