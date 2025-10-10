// function to choice random array element
function choice<T>(arr: T[]): T | undefined {
  if (arr.length === 0) {
    return undefined;
  }
  const randomIndex = Math.floor(Math.random() * arr.length);
  return arr[randomIndex];
}

// function to get random number
function getRandomInt(min: number, max: number): number {
  min = Math.ceil(min); // Ensure min is an integer
  max = Math.floor(max); // Ensure max is an integer
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const phrases = ["NeforLove"];

export function generate_phrase(): string {
  const phrase = choice(phrases);
  const num = getRandomInt(10000, 99999);

  return `${phrase} ${num}`;
}

export const generateReferralCode = () => {
  return Math.random().toString(36).slice(2, 10).toUpperCase();
};
