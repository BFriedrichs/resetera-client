const ensure = (obj, key, type = {}) => {
  if (!(key in obj)) obj[key] = type;
};

export default ensure;
