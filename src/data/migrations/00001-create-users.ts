import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("users", (table) => {
    table.increments("id").primary();
    table.text("email").notNullable().unique();
    table.text("firstName").notNullable();
    table.text("lastName").notNullable();
    table.text("passwordHash").notNullable();
    table.text("confirmationTokenHash");
    table.text("forgotPasswordTokenHash");
    table.timestamp("forgotPasswordExpiry");
    table.timestamp("createdAt").notNullable().defaultTo(knex.fn.now());
    table.timestamp("updatedAt").notNullable().defaultTo(knex.fn.now());
    table.boolean("deleted").notNullable().defaultTo(false);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("users");
}
