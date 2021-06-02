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
# Windows Users
If you see this error:
    The command 'docker-compose' could not be found in this WSL 2 distro. 
Make sure in your docker desktop under Settings/General that
"Use the WSL 2 based engine" is checked.
## Production config

If deploying to production, first place your config files in `/etc/mintbean-v4/config/*`.
Then run `yarn start`.
