# DevCollective.io

## Local development

### 1. Install Docker

You'll need to install Docker to enable Postgres. Windows users, please make sure to install WSL2 extensions as these are required for postgres to function correctly.

### 2. Install Yarn

For a variety of reasons, this project depends on yarn. You can install it using:

```sh
npm install -g yarn
```

### 3. Yarn install

This will install your dependencies.

```sh
yarn
```

### 4. Start your database

```sh
yarn dbup
```

This step creates 2 Postgres databases in Docker. The one on port 10800 is
development, while the one on port 10801 is for unit tests.

#### Windows users:

If you see this error:

```
The command 'docker-compose' could not be found in this WSL 2 distro.
```

Then make sure in your docker desktop under Settings/General that "Use the WSL
2 based engine" is checked.

### 5. Run Pristine to create all your databases.

We have a convenienent command, `yarn pristine`, that re-creates and re-seeds
the database. You can use this command at any time to wipe your database and
reset it.

```sh
yarn pristine
```

#### Run Pristine every time the DB changes.

Pristine must be run after every DB change in order to update your database with
the latest migrations.

#### Pristine can be used to reset your database

Pristine can be run at any time to reset your database to a clean state. This can
come in handy in many situations.

#### If you encounter problems that Pristine doesn't solve

If you encounter deeper problems, you may want to just destroy your postgres instances
and start from absolute scratch. There is a command that will destroy ALL docker images,
containers, volumes that are not currently running. First, you will want to stop all
docker processes related to this project, and then run `docker system prune -a`. NOTE:
This is a dangerous command that will destroy EVERYTHING that isn't currently running
in Docker, including any non-DC.io projects.

### 6. Start your server

Finally, you can run the command `yarn dev` (Windows: `yarn dev:win`) to start the server. This will serve
both the frontend and the backend on port 3000.

### 7. Optional: Set up VSCode extensions

The [debugging menu](https://code.visualstudio.com/docs/editor/debugging) on VSCode, which relies on launch.json,
has been populated with a couple of run options. One runs the server, while the other runs the unit tests.
Both of these are enabled with breakpoints, and can be a great
way for you too debug your code when necessary.

This project is set up to play nicely with [VSCode Jest](https://marketplace.visualstudio.com/items?itemName=Orta.vscode-jest).
It will run your tests in the background and also give you useful "debug" buttons for specific tests.
Highly recommended for any backend work.

Installing [VSCode GraphQL](https://marketplace.visualstudio.com/items?itemName=GraphQL.vscode-graphql) enables graphql syntax highlighting.
Recommended for GQL work.

## Useful docs

[How to make your first pull request](./docs/FirstPullRequest.md) - Thank you, Julio Alcantara!
[How to create new entities](./docs/HowToCreateNewEntities.md)
[How to sync your repo with updated code](./docs/HowToSyncUpdatedRepo.md)

# Production config

If deploying to production, first place your config files in `/etc/mintbean-v4/config/*`.
Then run `yarn start`.
