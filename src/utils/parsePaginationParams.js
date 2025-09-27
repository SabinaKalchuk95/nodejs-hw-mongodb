const parseNumber = (number, defaultValue) => {
  if (typeof number !== 'string') return defaultValue;
  const parsed = parseInt(number);
  return Number.isNaN(parsed) ? defaultValue : parsed;
};

export const parsePaginationParams = (query) => {
  const { page, perPage } = query;
  return {
    page: parseNumber(page, 1),
    perPage: parseNumber(perPage, 10),
  };
};

export const calculatePaginationData = (totalItems, perPage, page) => {
  const totalPages = Math.ceil(totalItems / perPage);
  
  const hasPreviousPage = page > 1;
  
  const hasNextPage = page < totalPages;

  return {
    page,
    perPage,
    totalItems,
    totalPages,
    hasPreviousPage,
    hasNextPage,
  };
};