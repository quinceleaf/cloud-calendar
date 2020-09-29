export const dynamicSort = (property) => {
  let sortOrder = 1;

  if (property[0] === "-") {
    sortOrder = -1;
    property = property.substr(1);
  }

  return function (a, b) {
    if (sortOrder == -1) {
      return b[property].localeCompare(a[property]);
    } else {
      return a[property].localeCompare(b[property]);
    }
  };
};

export const alphabeticalList = (objectList, alphaField) => {
  return objectList.sort(dynamicSort(alphaField));
};

export const filterList = (objectList, filterField, filterTerm) => {
  if (!objectList || objectList.length === 0) {
    return [];
  }
  return objectList.filter((obj) =>
    obj[filterField].toLowerCase().includes(filterTerm.toLowerCase())
  );
};

export const paginateList = (objectList, currentPage, objectsPerPage) => {
  if (!objectList || objectList.length === 0) {
    return [];
  }
  const pageWindowEnd = currentPage * objectsPerPage;
  const pageWindowStart = pageWindowEnd - objectsPerPage;
  return objectList.slice(pageWindowStart, pageWindowEnd);
};
