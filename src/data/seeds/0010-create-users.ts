import knex from "../knex";

export async function seed(): Promise<void> {
  await knex("users").del();

  await knex("users").insert([
    {
      id: "00000000-0000-0000-0000-000000000000",
      email: "a@a.com",
      firstName: "Amy",
      lastName: "Adams",
      passwordHash:
        "$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.",
      createdAt: "2019-10-15",
    },
    {
      id: "00000000-0000-4000-a000-000000000000",
      email: "b@b.com",
      firstName: "Bob",
      lastName: "Barker",
      passwordHash:
        "$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.",
      createdAt: "2020-04-15",
    },
    {
      id: "00000000-0000-4000-b000-000000000000",
      email: "c@c.com",
      firstName: "Chevy",
      lastName: "Chase",
      passwordHash:
        "$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.",
      createdAt: "2020-08-15",
    },
    {
      id: "65cf0c36-3d8a-4f48-b835-bad10edbdb64",
      email: "d@d.com",
      firstName: "Dorthy",
      lastName: "Downer",
      passwordHash:
        "$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.",
      createdAt: "2019-08-15",
    },
    {
      id: "1970d7de-a08c-4f36-b461-f9351cbec8b4",
      email: "e@e.com",
      firstName: "Earl",
      lastName: "Grey",
      passwordHash:
        "$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.",
      createdAt: "2017-08-15",
    },
    {
      id: "8958cb5e-4491-434e-b8eb-ca04077a0718",
      email: "f@f.com",
      firstName: "Fareed",
      lastName: "Z",
      passwordHash:
        "$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.",
      createdAt: "2020-08-15",
    },
    {
      id: "f7390f83-d84e-4bdd-b032-9726024cc6aa",
      email: "g@g.com",
      firstName: "Germanatta",
      lastName: "Gusputo",
      passwordHash:
        "$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.",
      createdAt: "2020-08-15",
    },
  ]);
}
