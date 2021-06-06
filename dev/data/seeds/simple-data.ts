import { datasetLoader } from "../../test/datasetLoader";

export async function seed(): Promise<void> {
  await datasetLoader();
}
