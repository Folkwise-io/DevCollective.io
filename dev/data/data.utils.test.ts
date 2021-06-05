import { autoIncrement } from "./utils";

describe("Auto Increment", () => {
  it("increments as expected", () => {
    const foo = autoIncrement();

    expect([foo(), foo(), foo()]).toMatchObject([1, 2, 3]);
  });

  it("increments independently", () => {
    const foo = autoIncrement();
    const bar = autoIncrement();
    const baz = autoIncrement();

    expect([foo(), foo(), foo()]).toMatchObject([1, 2, 3]);
    expect([bar(), bar(), bar()]).toMatchObject([1, 2, 3]);
    expect([baz(), baz(), baz()]).toMatchObject([1, 2, 3]);
    expect([foo(), bar(), baz()]).toMatchObject([4, 4, 4]);
    expect([foo(), bar(), baz()]).toMatchObject([5, 5, 5]);
    expect([foo(), bar(), baz()]).toMatchObject([6, 6, 6]);
    expect([foo(), foo(), foo()]).toMatchObject([7, 8, 9]);
    expect([foo(), bar(), baz(), baz()]).toMatchObject([10, 7, 7, 8]);
  });
});
