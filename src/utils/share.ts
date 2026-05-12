import type { Recipe } from '../types/recipe';

export const encodeRecipe = (recipe: Recipe): string => {
  try {
    const json = JSON.stringify(recipe);
    return btoa(encodeURIComponent(json));
  } catch (e) {
    console.error('Failed to encode recipe', e);
    return '';
  }
};

export const decodeRecipe = (hash: string): Recipe | null => {
  try {
    const json = decodeURIComponent(atob(hash));
    return JSON.parse(json);
  } catch (e) {
    console.error('Failed to decode recipe', e);
    return null;
  }
};