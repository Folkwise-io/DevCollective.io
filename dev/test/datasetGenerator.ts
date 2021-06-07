<<<<<<< HEAD
import fs from "fs";
import path from "path";
import datasetFactory from "../data/factories/datasetFactory";

const writer = (newDir: string) => (filename: string, data: any) =>
  fs.writeFileSync(path.resolve(newDir, filename + ".json"), JSON.stringify(data, null, 2));

// Run immediately
(function () {
  // modify these to generate.
  const data = datasetFactory({
    totalCommunities: 10,
    totalUsers: 100,
    totalPosts: 1000,
    userCommunityProbability: 0.5,
  });

  // make new directory
  const time: number = Date.now();
  const newDir = path.resolve(__dirname, `${time}`);
  fs.mkdirSync(newDir);

  const write = writer(newDir);
  write("users", data.users);
  write("communities", data.communities);
  write("communitiesUsers", data.communitiesUsers);
  write("posts", data.posts);
})();
=======
import fs from "fs";
import path from "path";
import datasetFactory from "../data/factories/datasetFactory";
import { FOLDER_PATH } from "./constants";

const write = (filename: string, data: any) =>
  fs.writeFileSync(path.resolve(FOLDER_PATH, filename + ".json"), JSON.stringify(data, null, 2));

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
  write("users", data.users);
  write("communities", data.communities);
  write("communitiesUsers", data.communitiesUsers);
  write("posts", data.posts);
})();
>>>>>>> 96f06fc11fa1f55f86da9ccddc9c8db27ccf30a2
