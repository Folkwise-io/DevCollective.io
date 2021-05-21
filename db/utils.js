const isObject = (x) => typeof x === "object" && x !== null;

const objectSubset =
  (...fields) =>
  (obj) => {
    const newObj = {};

    fields.forEach((field) => {
      if (field in obj) {
        newObj[field] = obj[field];
      }
    });

    return newObj;
  };

const pick =
  (...fields) =>
  (obj) => {
    if (obj instanceof Array) {
      return obj.map((o) => objectSubset(...fields)(o));
    } else {
      return objectSubset(...fields)(obj);
    }
  };

const pickOne = (field) => (obj) => {
  if (obj instanceof Array) {
    return obj.map((o) => o[field]);
  } else {
    return obj[field];
  }
};
module.exports = {
  pick,
  pickOne,
};
