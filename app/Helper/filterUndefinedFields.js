function filterUndefinedFields(obj) {
  const filteredEntries = Object.entries(obj).filter(
    ([key, value]) => value !== undefined
  );
  const filteredObject = Object.fromEntries(filteredEntries);

  return filteredObject;
}

module.exports = { filterUndefinedFields };
