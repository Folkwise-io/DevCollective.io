import fs from "fs";
import path from "path";

import datasetFactory from "../data/factories/datasetFactory";
import { FOLDER_PATH } from "./constants";

const write = (filename: string, data: any) =>
  fs.writeFileSync(path.resolve(FOLDER_PATH, filename + `.json`), JSON.stringify(data, null, 2));

// Run immediately
(function () {
  // modify these to generate.
  const data = datasetFactory({
    totalCommunities: 10,
    totalUsers: 100,
    totalPosts: 1000,
    userCommunityProbability: 0.5,
  });

  // write the files
  write(`users`, data.users);
  write(`communities`, data.communities);
  write(`communitiesUsers`, data.communitiesUsers);
  write(`posts`, data.posts);
})();
