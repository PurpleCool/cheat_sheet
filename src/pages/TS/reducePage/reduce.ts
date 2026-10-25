function reduce(array, callback, initial) {
  let acc = initial;

  for (let i = 0; i < array.length; i++) {
    acc = callback(acc, array[i], i);
  }

  return acc;
}

export default reduce;
