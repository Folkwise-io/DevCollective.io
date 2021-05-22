import { communities } from "./fake-data";
import { fieldGetterHoc, pickOne } from "./utils";
import DataLoader from "dataloader";

const communityLoader = new DataLoader(async (ids) =>
  communities.filter((community) => ids.indexOf(community.id) >= 0)
);

export const getCommunityFieldById = fieldGetterHoc((id) =>
  communityLoader.load(id)
);

export const getAllCommunityIds = () =>
  Promise.resolve(communities).then(pickOne("id"));
