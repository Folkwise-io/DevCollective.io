export const pickOne =
  (field: string) =>
  <T>(obj: T): T => {
    if (obj instanceof Array) {
      // @ts-ignore
      return obj.map((o) => o[field]);
    } else {
      // @ts-ignore
      return obj[field];
    }
  };

// TODO: Tighten up types. This should just accept a string... i think.
export const fieldGetterHoc = (cb: (id: string) => Promise<any>) => {
  return async (id: string, fieldName: string) => {
    const object = await cb(id);
    if (!object) {
      return null;
    } else {
      return object[fieldName];
    }
  };
};
