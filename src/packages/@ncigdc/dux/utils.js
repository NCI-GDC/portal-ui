export const namespaceActions = (namespace, constants) =>
  Object.freeze(
    constants.reduce(
      (obj, constant) => ({
        ...obj,
        [constant]: `${namespace}/${constant}`,
      }),
      {}
    )
  );
