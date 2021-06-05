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

## Recommended VSCode Plugins

This project is set up to play nicely with [VSCode Jest](https://marketplace.visualstudio.com/items?itemName=Orta.vscode-jest).
It will run your tests in the background and also give you useful "debug" buttons for specific tests.
Highly recommended for any backend work.

[VSCode GraphQL](https://marketplace.visualstudio.com/items?itemName=GraphQL.vscode-graphql) enables graphql syntax highlighting.
Highly recommended for any backend work.

# Production config

If deploying to production, first place your config files in `/etc/mintbean-v4/config/*`.
Then run `yarn start`.
