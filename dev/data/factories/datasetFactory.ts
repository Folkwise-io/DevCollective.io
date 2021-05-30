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
      confirmationTokenHash: "$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.", // also "password" for convenience
      forgotPasswordExpiry: null,
      forgotPasswordTokenHash: null,
      createdAt: new Date("2019-10-15"),
      updatedAt: new Date(),
    },
    ...fillArray(totalUsers - 1, userFactory),
  ];
  const communities: DCommunity[] = [
    {
      id: faker.datatype.uuid(),
      title: "Mintbean",
      callsign: "mintbean",
      description:
        "We help job-seeking coders get ahead in their careers through our learnathons. Wanna get started? Come join our Discord chat: http://discord.com/invite/j7CjBAz",
      createdAt: new Date("2019-12-12"),
      updatedAt: new Date(),
    },
    ...fillArray(totalCommunities - 1, () => communityFactory()),
  ];
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
