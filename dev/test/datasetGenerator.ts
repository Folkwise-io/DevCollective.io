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
