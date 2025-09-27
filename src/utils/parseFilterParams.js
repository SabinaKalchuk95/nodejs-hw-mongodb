const parseContactType = (type) => {
  if (typeof type !== 'string') return;
  
  return ['work', 'home', 'personal'].includes(type) ? type : undefined;
};

const parseIsFavourite = (isFavourite) => {
  if (typeof isFavourite !== 'string') return;
  
  return isFavourite === 'true' ? true : isFavourite === 'false' ? false : undefined;
};

export const parseFilterParams = (query) => {
  const { contactType, isFavourite } = query;
  return {
    contactType: parseContactType(contactType),
    isFavourite: parseIsFavourite(isFavourite),
  };
};