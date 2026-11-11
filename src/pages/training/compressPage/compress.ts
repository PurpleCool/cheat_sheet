export default function compress(numbers: number[]): string {
  if (numbers.length === 0) return "";

  const sorted = [...new Set(numbers)].sort((a, b) => a - b);
  const result: string[] = [];

  let min = sorted[0];
  let max = sorted[0];

  for (let i = 1; i < sorted.length; i++) {
    const current = sorted[i];

    if (current === max + 1) {
      max = current;
    } else {
      result.push(min === max ? String(min) : `${min}-${max}`);

      min = current;
      max = current;
    }
  }

  // Не забываем последний диапазон
  result.push(min === max ? String(min) : `${min}-${max}`);

  return result.join(", ");
}
