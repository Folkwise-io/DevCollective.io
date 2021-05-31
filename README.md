# Getting Started

## Prerequisites

You'll need Docker installed to run the development database. This is optional, but we don't yet have instructions for manual Postgres setup.

## Steps to start

```sh
# install dependencies
yarn install

# start the server on port 8080 and, if not started, the Postgres server on port 10800
yarn dev

# create (or re-create) the database from scratch
yarn pristine
```

## Production config

If deploying to production, first place your config files in `/etc/mintbean-v4/config/*`.
Then run `yarn start`.
