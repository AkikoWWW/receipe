export type Unit = 'г' | 'мл' | 'шт' | 'ч.л.' | 'ст.л.';

export interface Ingredient {
  id: string;
  name: string;
  amount: number;
  unit: Unit;
}

export interface RecipeStep {
  id: string;
  description: string;
  timerSeconds: number | null;
  ingredientIds: string[];
}

export interface Recipe {
  title: string;
  servings: number;
  ingredients: Ingredient[];
  steps: RecipeStep[];
}