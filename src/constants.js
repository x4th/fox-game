export const TICK_RATE = 500;
export const ICONS = ["fish", "poop", "weather"];
export const RAIN_CHANCE = 0.2;
export const SCENES = ["day", "rain"];
export const DAY_LENGTH = 60;
export const NIGHT_LENGTH = 3;

export function getNextHungerTime(clock) {
  return Math.floor(Math.random() * 3) + 5 + clock;
}
export function getNextDieTime(clock) {
  return Math.floor(Math.random() * 2) + 3 + clock;
}
export function getNextPoopTime(clock) {
  return Math.floor(Math.random() * 3) + 4 + clock;
}
