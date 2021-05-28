CURRENT

- Create posts
- Move all records from UUID to numeric incremented IDs and expose a 6key Base36 ID in the URL. This can be done using (100).toString(36) and parseInt("2s"). For convenience, this can be done directly in the DAO layer... doing this will prevent the need to replace String types with Number types across much of the service layer.

FRIDAY - MUST DO

- Threaded discussion
- Sign up + emails
- Admin functionality - Delete replies, delete posts

LATER

- better error handling and more rainy day cases
- Upvotes and downvote posts
- mobile friendly
- password reset
- Sidebar - "What is this?" and "Join Discord"
- Upvotes and downvote replies
- Community search
- New posts, top posts
- Create communities (admin only)
- join and leave communities
- basic hardening of graphql endpoint against malicious actors
- Community statistics (number of members, total number of posts, number of posts in last 24h / 7d / 30d)
- Hot posts
- authorization and the permission model https://www.apollographql.com/docs/apollo-server/security/authentication/#authorization-methods
- Create more beautiful tooling. Datasetgenerator and datasetloader are useful but very raw right now.
- Clear up "any"s

DONE

- Community handles
- Single hardcoded community (c/mintbean)
- unit tests for api
- database connection
- authentication and the user model

KNOWN ISSUES

hmr is not working. i've followed this advice. https://github.com/webpack-contrib/webpack-hot-middleware/issues/391#issuecomment-841196392
