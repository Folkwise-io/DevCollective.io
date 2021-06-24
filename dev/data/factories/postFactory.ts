import faker from "faker";

import { autoIncrement } from "../utils";

const n = autoIncrement();

export default function postFactory(users: DUser[], communities: DCommunity[]): DPost {
  return {
    id: n(),
    title: faker.lorem.sentence(),
    body: faker.lorem.paragraphs(faker.datatype.number(3)),
    createdAt: faker.datatype.datetime(),
    communityId: faker.random.arrayElement(communities).id,
    authorId: faker.random.arrayElement(users).id,
    updatedAt: new Date(),
  };
}
