const compactFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 1,
  notation: "compact",
});

export const formatNumber = (value: number, fallback = "0") => {
  if (!Number.isFinite(value)) {
    return fallback;
  }

  if (Math.abs(value) < 1_000) {
    return value.toFixed(1);
  }

  return compactFormatter.format(value);
};

export const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

export const average = (values: number[]) => {
  if (!values.length) {
    return 0;
  }

  const total = values.reduce((sum, current) => sum + current, 0);
  return total / values.length;
};

export const percentFromFraction = (fraction: number) => `${Math.round(clamp(fraction, 0, 1) * 100)}%`;
