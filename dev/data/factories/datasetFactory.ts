import faker from "faker";
import { fillArray } from "../utils";
import communityFactory from "./communityFactory";
import postFactory from "./postFactory";
import communityUserMixer from "./communityUserFactory";
import userFactory from "./userFactory";

interface DatasetFactoryParams {
  totalUsers: number;
  totalCommunities: number;
  totalPosts: number;
  userCommunityProbability: number;
}

/**
 * A function that creates a dataset. The first user is always "a@a.com" // "password"
 * @param params
 * @returns
 */
const datasetFactory = (params: DatasetFactoryParams) => {
  const { totalUsers, totalCommunities, totalPosts, userCommunityProbability } = params;

  const users: DUser[] = [
    {
      id: faker.datatype.uuid(),
      email: "a@a.com",
      firstName: "Amy",
      lastName: "Adams",
      passwordHash: "$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.", // "password"
      createdAt: new Date("2019-10-15"),
      updatedAt: new Date(),
    },
    ...fillArray(totalUsers - 1, userFactory),
  ];
  const communities = fillArray(totalCommunities, () => communityFactory());
  const communitiesUsers = communityUserMixer(communities, users, userCommunityProbability);
  const posts = fillArray(totalPosts, () => postFactory(users, communities));

  return {
    users,
    communities,
    communitiesUsers,
    posts,
  };
};

export default datasetFactory;
