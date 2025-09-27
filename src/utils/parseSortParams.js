export const SORT_ORDER = { ASC: 'asc', DESC: 'desc' };

const parseSortOrder = (sortOrder) => 
  [SORT_ORDER.ASC, SORT_ORDER.DESC].includes(sortOrder) ? sortOrder : SORT_ORDER.ASC;

const parseSortBy = (sortBy) => 
  ['_id', 'name', 'contactType', 'isFavourite', 'createdAt', 'updatedAt'].includes(sortBy)
    ? sortBy
    : 'name';

export const parseSortParams = (query) => {
  const { sortOrder, sortBy } = query;
  return {
    sortOrder: parseSortOrder(sortOrder),
    sortBy: parseSortBy(sortBy),
  };
};