import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import tarotData from "$lib/assets/tarot-cards.json";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const { majorArcana } = tarotData;

export function shuffleCards(cards) {
  return [...cards].sort(() => Math.random() - 0.5);
}

export function drawCards(deck, count) {
  const shuffled = shuffleCards(deck);
  return shuffled.slice(0, count);
}

export function getCardByName(name) {
  return majorArcana.find((card) => card.name === name);
}

export function getCardById(id) {
  return majorArcana.find((card) => card.id === id);
}
