const reverse = func => state => arg => {
  return func(arg)(state);
};

export default reverse;
