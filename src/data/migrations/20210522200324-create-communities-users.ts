import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("communitiesUsers", (table) => {
    table.uuid("communityId").notNullable();
    table.uuid("userId").notNullable();
    table.timestamp("createdAt").notNullable().defaultTo(knex.fn.now());
    table.timestamp("updatedAt").notNullable().defaultTo(knex.fn.now());

    // Constraints and indices
    table.primary(["communityId", "userId"]);
    table.foreign("communityId").references("communities.id").onDelete("CASCADE");
    table.foreign("userId").references("users.id").onDelete("CASCADE");
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("communitiesUsers");
}
