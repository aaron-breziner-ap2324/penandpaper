export const DURATION_PRICES = [
  { minutes: 45, label: "45 minutos", price: 20 },
  { minutes: 60, label: "1 hora", price: 25 },
  { minutes: 75, label: "1 hora y 15", price: 30 },
  { minutes: 90, label: "1 hora y media", price: 35 },
  { minutes: 105, label: "1 hora y 45", price: 40 },
  { minutes: 120, label: "2 horas", price: 45 },
] as const;

export const PLATFORM_FEE_RATE = 0.2;

export const MIN_SESSION_PRICE = DURATION_PRICES[0].price;

export function priceForDuration(minutes: number): number {
  const match = DURATION_PRICES.find((d) => d.minutes === minutes);
  if (!match) {
    throw new Error("Duración inválida");
  }
  return match.price;
}

export function platformFee(price: number): number {
  return Math.round(price * PLATFORM_FEE_RATE);
}

export function tutorPayout(price: number): number {
  return price - platformFee(price);
}
