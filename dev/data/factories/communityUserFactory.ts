/**
 *
 * @param communities
 * @param users
 * @param probability A probability between 0.00 and 1.00 that determines how many users will join how many communities.
 * @returns
 */
export default function communityUserJoinFactory(
  communities: DCommunity[],
  users: DUser[],
  probability: number,
): DCommunitiesUsers[] {
  const communitiesUsers: DCommunitiesUsers[] = [];

  communities.forEach((c) => {
    users.forEach((u) => {
      if (Math.random() <= probability)
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
