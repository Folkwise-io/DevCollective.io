# How to create new entities

This doc seems like a long one, but it's not too hard to do. You'll do it even faster once you get the hang of it. Treat this document like a map that will help you get to your destination -- i.e., feel free to explore surrounding territory should your heart desire, this doc is only a helpful guide.

1. Create empty tests that are filled only with comments that describe how the test will work. These tests dont do anything right now, but you'll fill them up later with working code.
1. Create a migration by copy-pasting an old one. Make sure the `down` method refers to the new table.
1. Create a new entry in `database.d.ts`
1. Create a Repo file in `src/data`. Follow existing patterns. Note: If you need any complex logic beyond request parsing and database querying, that would go inside a `src/service/*` file. (HINT: At this point, you can go and fill in more of your unit tests.)
1. Create a Factory to create fake data inside `dev/data/factories`
1. Add your entity to `datasetFactory` in a way that makes sense for your code.
1. Add your entity to `datasetGenerator` which will generate complex datasets for our use. Provide the `datasetFactory` parameters in a way that makes sense for your new entity.
1. Add your entity to `datasetLoader` which will load up datasets by name into our database.
1. Now you want to generate new data to update the `dev/test/dataset` folder with your new entity. These are used across all of our unit tests and are also loaded up as dev data. After modifying `datasetGenerator` in the previous steps, you can use the `yarn dev:generate-dataset` command to generate a dataset automatically. Your datasets will be replaced automatically.
1. At this point, you can go and fill in all of your tests completely. Do this first so that you can have failing tests before you go and create Schemas.
1. Create a Schema for your new entity in `src/schemas` and make all the necessary joins on the schema level.
1. At this point, you want to build-test-fix against your unit tests until your tests pass.
