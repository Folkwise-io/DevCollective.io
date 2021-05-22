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

export const fieldGetterHoc = (cb: (id: string) => Promise<any>) => {
  return async (id: string, fieldName: string) => {
    const community = await cb(id);
    if (!community) {
      return null;
    } else {
      return community[fieldName];
    }
  };
};
