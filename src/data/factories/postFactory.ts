import faker from "faker";

export default function postFactory(users: DUser[], communities: DCommunity[]) {
  return {
    id: faker.datatype.uuid(),
    title: faker.lorem.sentence(),
    body: faker.lorem.paragraphs(faker.datatype.number(3)),
    createdAt: faker.datatype.datetime(),
    communityId: faker.random.arrayElement(communities).id,
    authorId: faker.random.arrayElement(users).id,
  };
}
