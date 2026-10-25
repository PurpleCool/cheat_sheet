function reduce<Item, Initial>(array: Item[], callback: (acc: Initial, item: Item, i: number) => Initial, initial: Initial): Initial {
  let acc = initial;

  for (let i = 0; i < array.length; i++) {
    acc = callback(acc, array[i], i);
  }

  return acc;
}

export default reduce;
