export const fillArray = <T>(num = 0, cb: (i: number) => T): T[] => {
  const arr = [];
  for (let i = 0; i < num; i++) {
    arr.push(cb(i));
  }
  return arr;
};

export const autoIncrement = () => {
  let i = 1;
  return () => i++;
};
