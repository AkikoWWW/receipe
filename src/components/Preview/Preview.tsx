import React, { useMemo } from 'react';
import type { Recipe } from '../../types/recipe';
import { Timer } from '../UI/Timer'; 

export const Preview: React.FC<{ recipe: Recipe }> = ({ recipe }) => {
  const scaledIngredients = useMemo(() => {
    return recipe.ingredients.map(ing => ({
      ...ing,
      amount: ing.amount * recipe.servings
    }));
  }, [recipe.ingredients, recipe.servings]);

  return (
    <div className="preview-card">
      <header className="preview-header">
        <h2>{recipe.title || 'Новий рецепт'}</h2>
        <div className="servings-badge">Порцій: {recipe.servings}</div>
      </header>

      <div className="preview-content">
        <div className="ingredients-list">
          <h4>Інгредієнти</h4>
          <ul>
            {scaledIngredients.map(ing => (
              <li key={ing.id}>
                {ing.name}: <strong>{ing.amount} {ing.unit}</strong>
              </li>
            ))}
          </ul>
        </div>

        <div className="steps-list">
          <h4>Кроки приготування</h4>
          {recipe.steps.map((step, index) => (
            <div key={step.id} className="step-item">
              <div className="step-number">{index + 1}</div>
              <div className="step-body">
                <p>{step.description}</p>
                {step.timerSeconds && <Timer seconds={step.timerSeconds} />}
                <div className="step-ingredients">
                   {recipe.ingredients
                    .filter(i => step.ingredientIds.includes(i.id))
                    .map(i => <span key={i.id} className="chip">{i.name}</span>)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};