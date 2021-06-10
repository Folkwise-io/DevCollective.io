# Development

## Prerequisites

You'll need Docker installed to run the development database. This is optional, but we don't yet have instructions for manual Postgres setup.

## Steps to start the server locally

```sh
# install dependencies
yarn install

# start the server on port 8080 and, if not started, the Postgres server on port 10800
yarn dev

# create (or re-create) the database from scratch
yarn pristine
```

## Windows Users

If you see this error:
The command 'docker-compose' could not be found in this WSL 2 distro.
Make sure in your docker desktop under Settings/General that
"Use the WSL 2 based engine" is checked.

## Working with VSCode

The run menu on VSCode, which relies on launch.json, has been populated with a couple of run options. One runs the
server, while the other runs the unit tests. Both of these are enabled with breakpoints, and can be a great 
way for you too debug your code when necessary.

## Recommended VSCode Plugins

This project is set up to play nicely with [VSCode Jest](https://marketplace.visualstudio.com/items?itemName=Orta.vscode-jest).
It will run your tests in the background and also give you useful "debug" buttons for specific tests.
Highly recommended for any backend work.

[VSCode GraphQL](https://marketplace.visualstudio.com/items?itemName=GraphQL.vscode-graphql) enables graphql syntax highlighting.
Highly recommended for any backend work.

## Useful docs

[How to make your first pull request](./docs/FirstPullRequest.md) - Thank you, Julio Alcantara!
[How to create new entities](./docs/HowToCreateNewEntities.md)

# Production config

If deploying to production, first place your config files in `/etc/mintbean-v4/config/*`.
Then run `yarn start`.
