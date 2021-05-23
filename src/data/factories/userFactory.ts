import faker from "faker";

export default function userFactory() {
  return {
    id: faker.unique(() => faker.datatype.uuid()),
    email: faker.unique(() => faker.internet.email()),
    passwordHash:
      "$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.", // "password"
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    createdAt: faker.date.past(),
    updatedAt: new Date(),
  };
}
