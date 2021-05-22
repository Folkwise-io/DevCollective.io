import knex from "../knex";

export async function seed(): Promise<void> {
  const TABLE_NAME = "communitiesUsers";

  await knex(TABLE_NAME).del();

  await knex<DCommunitiesUsers>(TABLE_NAME).insert([
    {
      communityId: "00000000-0000-0000-0000-000000000000",
      userId: "00000000-0000-4000-a000-000000000000",
    },
    {
      communityId: "00000000-0000-0000-0000-000000000000",
      userId: "00000000-0000-4000-a000-000000000000",
    },
    {
      communityId: "00000000-0000-0000-0000-000000000000",
      userId: "00000000-0000-4000-b000-000000000000",
    },
    {
      communityId: "00000000-0000-4000-a000-000000000000",
      userId: "00000000-0000-4000-a000-000000000000",
    },
    {
      communityId: "00000000-0000-4000-a000-000000000000",
      userId: "00000000-0000-4000-a000-000000000000",
    },
    {
      communityId: "00000000-0000-4000-a000-000000000000",
      userId: "65cf0c36-3d8a-4f48-b835-bad10edbdb64",
    },
    {
      communityId: "00000000-0000-4000-b000-000000000000",
      userId: "00000000-0000-4000-a000-000000000000",
    },
    {
      communityId: "00000000-0000-4000-b000-000000000000",
      userId: "65cf0c36-3d8a-4f48-b835-bad10edbdb64",
    },
    {
      communityId: "00000000-0000-4000-b000-000000000000",
      userId: "1970d7de-a08c-4f36-b461-f9351cbec8b4",
    },
  ]);
}
