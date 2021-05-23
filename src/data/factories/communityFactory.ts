import faker from "faker";

export default function communityFactory(): DCommunity {
  return {
    id: faker.unique(() => faker.datatype.uuid()),
    title: faker.unique(() => faker.company.companyName()),
    description: faker.company.bs(),
    createdAt: faker.date.past(),
    updatedAt: new Date(),
  };
}
