CURRENT

- FS: error handling / toast notifications
- FE: If user email is not confirmed, nag.
- FE: user registration frontend

ROADMAP TO V.01

- FE: confirm account frontend
- FE: reset password frontend
- FS: c/cd and production deployment
- Threaded comments

ROADMAP TO V1

Tier 1

- COOL: keyboard shortcut and navigation system
- COOL: embedded terminal
- mobile friendly
- Pagination
- Search posts by title, body or author. This supports special characters.
- Upvote and downvote posts
- Report a post
- User profiles (CRUD on first name, last name, password, email)
- authorization and the permission model https://www.apollographql.com/docs/apollo-server/security/authentication/#authorization-methods
- permission: if the user has not confirmed their email, they cannot post.
- better error handling and more rainy day cases
  - verbose errors to be returned in the errors array during test and development
  - slim errors to be returned in the errors array during production
  - we will maintain error codes for more systematic debugging
  - graphql will have an error codes query so that UI can "introspect" possible error codes and messages
- Hot posts, new posts, top posts
- basic hardening of graphql endpoint against malicious actors (cloudflare.. also see https://www.npmjs.com/package/express-rate-limit)
- notifications
- better email templates

Tier 2 (these depend on at least one Tier 1 ticket)

- Admin - create communities
- Admin - set moderators
- Admin - shadow delete posts.
- Admin - shadow delete comments. If a comment is shadow deleted, its children don't show up either.
- Admin - shadow ban users. If a user is shadow banned, their posts and comments don't show up.
- Report a comment.
- Report a user profile.
- I can see my posts and comments.
- I can see others' posts and comments.
- When I create a profile or change my email, I need to verify my email in 14 days.
- Upvote and downvote comments
- Blogs for users.
- Profile for users.
  - Bio
  - Skills
  - Experience & projects
  - Education
- Search now also registers comments by body or author.
- Search user profiles by name
- Direct messaging

Tier 3 (these depend on at least one Tier 2 ticket)

- Admin - review queue for posts.
- Moderator - review queue for my communities' posts.
- Admin - review queue for comments.
- Moderator - review queue for my communities' comments' posts.
- Moderator - ban a user from my community.
- Admin - review queue for new and recently changed user profiles.

LATER (things we wont do for now)

- I can create my own community.
- I can join and leave communities
- Community search
- I can report a community.
- recruiter search
- Community statistics (number of members, total number of posts, number of posts in last 24h / 7d / 30d)
- ENGG: Create more beautiful, visual tooling. Datasetgenerator and datasetloader are useful but very raw and CLI-driven right now.
- ENGG: Clear up "any"s
- community themes
- community logos
- user avatars
- dark vs light mode

DONE

- Sidebar - "What is this?" and "Join Discord"
- Community handles
- Single hardcoded community (c/mintbean)
- unit tests for api
- database connection
- authentication and the user model
- Create posts
- Sign up + emails.
- confirm account backend
- reset password backend
- BE: make email lowercase-only
- BE: if user email is not confirmed, `user.accountConfirmationPending` flag on the `/auth` calls should be `true`
- BE: SEO: Move all records from UUID to numeric incremented IDs.

KNOWN ISSUES

- Make the cookie session key configurable.
