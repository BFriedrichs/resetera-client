const reverse = func => state => arg => {
  console.log(func, arg, state);
  return func(arg)(state);
};

export default reverse;
