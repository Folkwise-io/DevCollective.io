import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("communities", (table) => {
    table
      .uuid("id")
      .notNullable()
      .defaultTo(knex.raw("uuid_generate_v4()"))
      .unique();

    table.text("title").notNullable().unique();
    table.text("description").notNullable();
    table.timestamp("createdAt").notNullable().defaultTo(knex.fn.now());
    table.timestamp("updatedAt").notNullable().defaultTo(knex.fn.now());

    // Constraints and indices
    table.primary(["id"]);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("communities");
}
