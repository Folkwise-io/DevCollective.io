import knex from "../knex";

export async function seed(): Promise<void> {
  const TABLE_NAME = "communities";

  await knex(TABLE_NAME).del();

  await knex<DCommunity>(TABLE_NAME).insert([
    {
      id: "00000000-0000-0000-0000-000000000000",
      title: "React.js",
      description: "The best place in the world for ReactJS news.",
      createdAt: new Date("2019-10-15"),
    },
    {
      id: "00000000-0000-4000-a000-000000000000",
      title: "Vue.js",
      description: "The best place in the world for VueJS news.",
      createdAt: new Date("2020-04-15"),
    },
    {
      id: "00000000-0000-4000-b000-000000000000",
      title: "React.js",
      description: "The best place in the world for AngularJS news.",
      createdAt: new Date("2020-08-15"),
    },
  ]);
}
