<<<<<<< HEAD
import { datasetLoader } from "../../test/datasetLoader";

export async function seed(): Promise<void> {
  await datasetLoader("simple");
}
=======
import { datasetLoader } from "../../test/datasetLoader";

export async function seed(): Promise<void> {
  await datasetLoader();
}
>>>>>>> 96f06fc11fa1f55f86da9ccddc9c8db27ccf30a2
