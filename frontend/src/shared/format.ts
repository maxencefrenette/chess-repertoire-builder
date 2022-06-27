export function formatPercent(value: number) {
  return value.toLocaleString(undefined, {
    style: "percent",
    minimumFractionDigits: 2,
  });
}

export function formatFrequency(value: number) {
  if (typeof value !== "number" || value <= 0) {
    return;
  } else if (value > 0.5) {
    return value.toLocaleString(undefined, {
      style: "percent",
      minimumFractionDigits: 2,
    });
  } else {
    return `1 in ${Math.round(1 / value)}`;
  }
}
