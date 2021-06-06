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

export const fieldGetterHoc = (cb: (id: number) => Promise<any>) => {
  return async (id: number, fieldName: string) => {
    const community = await cb(id);
    if (!community) {
      return null;
    } else {
      return community[fieldName];
    }
  };
};
