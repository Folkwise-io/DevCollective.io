CURRENT

- better error handling and more rainy day cases
- Pagination
- Sign up + emails
- password reset
- Admin functionality - Delete replies, delete posts
- Threaded discussion
- Upvotes and downvote posts

LATER

- user profiles
- messaging
- notifications
- New posts, top posts
- recruiter search
- COOL: keyboard shortcut and navigation system
- COOL: embedded terminal
- Move all records from UUID to numeric incremented IDs and expose a 6key Base36 ID in the URL. This can be done using (100).toString(36) and parseInt("2s"). For convenience, this can be done directly in the DAO layer... doing this will prevent the need to replace String types with Number types across much of the service layer.
- mobile friendly
- Sidebar - "What is this?" and "Join Discord"
- Upvotes and downvote replies
- Community search
- Create communities (admin only)
- join and leave communities
- basic hardening of graphql endpoint against malicious actors
- Community statistics (number of members, total number of posts, number of posts in last 24h / 7d / 30d)
- Hot posts
- Create more beautiful, visual tooling. Datasetgenerator and datasetloader are useful but very raw and CLI-driven right now.
- Clear up "any"s
- authorization and the permission model https://www.apollographql.com/docs/apollo-server/security/authentication/#authorization-methods

DONE

- Community handles
- Single hardcoded community (c/mintbean)
- unit tests for api
- database connection
- authentication and the user model
- Create posts

KNOWN ISSUES

- Make the cookie session key configurable.
