export default function communityUserJoinFactory(communities: DCommunity[], users: DUser[]): DCommunitiesUsers[] {
  const communitiesUsers: DCommunitiesUsers[] = [];

  communities.forEach((c) => {
    users.forEach((u) => {
      communitiesUsers.push({
        userId: u.id,
        communityId: c.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    });
  });

  return communitiesUsers;
}
