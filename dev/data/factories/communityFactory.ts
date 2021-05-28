import faker, { company } from "faker";

export default function communityFactory(): DCommunity {
  const title = faker.company.companyName();
  const callsign = title.split(" ")[0].toLowerCase();

  return {
    id: faker.unique(() => faker.datatype.uuid()),
    title,
    callsign: faker.unique(() => callsign + faker.random.word()),
    description: faker.company.bs(),
    createdAt: faker.date.past(),
    updatedAt: new Date(),
  };
}
