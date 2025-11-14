export const randomBetween = (min: number, max: number) => Math.random() * (max - min) + min;

export const pickOne = <T>(collection: readonly T[]): T =>
  collection[Math.floor(Math.random() * collection.length)];

export const weightedPick = <T>(options: { value: T; weight: number }[]): T => {
  const total = options.reduce((sum, option) => sum + option.weight, 0);
  const roll = Math.random() * total;
  let accumulator = 0;

  for (const option of options) {
    accumulator += option.weight;
    if (roll <= accumulator) {
      return option.value;
    }
  }

  return options[options.length - 1].value;
};

export const jitter = (value: number, delta: number) => value + randomBetween(-delta, delta);
