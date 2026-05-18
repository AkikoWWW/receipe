import React from 'react';
import type { Recipe, Ingredient, Unit, RecipeStep } from '../../types/recipe';

interface Props {
  recipe: Recipe;
  setRecipe: React.Dispatch<React.SetStateAction<Recipe>>;
}

export const Editor: React.FC<Props> = ({ recipe, setRecipe }) => {
  const addIngredient = () => {
    const newIng: Ingredient = { 
      id: crypto.randomUUID(), 
      name: '', 
      amount: 1,
      unit: 'г' 
    };
    setRecipe(prev => ({ ...prev, ingredients: [...prev.ingredients, newIng] }));
  };

  const updateIngredient = (id: string, data: Partial<Ingredient>) => {
    setRecipe(prev => ({
      ...prev,
      ingredients: prev.ingredients.map(ing => {
        if (ing.id !== id) return ing;
        
        const updated = { ...ing, ...data };
        
        if (data.amount !== undefined && data.amount <= 0) {
          updated.amount = 1;
        }
        
        return updated;
      })
    }));
  };

  const addStep = () => {
    
    const newStep: RecipeStep = { 
      id: crypto.randomUUID(), 
      description: '', 
      timerSeconds: null, 
      ingredientIds: [] 
    };

    setRecipe(prev => ({ ...prev, steps: [...prev.steps, newStep] }));
  };

  const updateStep = (id: string, data: Partial<RecipeStep>) => {
    setRecipe(prev => ({
      ...prev,
      steps: prev.steps.map(step => step.id === id ? { ...step, ...data } : step)
    }));
  };

  return (
    <div className="editor-card">
      <input 
        className="title-input"
        value={recipe.title} 
        onChange={e => setRecipe(prev => ({ ...prev, title: e.target.value }))}
        placeholder="Назва рецепту..."
      />
      
      <div className="servings-control">
        <label>Порції:</label>
        <input 
          type="number" 
          value={recipe.servings} 
          min={1} 
          onChange={e => setRecipe(prev => ({ ...prev, servings: Math.max(1, Number(e.target.value)) }))} 
        />
      </div>

      <div className="section">
        <h3>Інгредієнти</h3>
        {recipe.ingredients.map(ing => (
          <div key={ing.id} className="row">
            <input 
              placeholder="Назва (обов'язково)"
              value={ing.name} 
              className={ing.name.trim() === '' ? 'input-error' : ''}
              onChange={e => updateIngredient(ing.id, { name: e.target.value })} 
            />
            <input 
              type="number" 
              min="0.1"
              step="any"
              placeholder="К-ть"
              value={ing.amount || ''} 
              onChange={e => updateIngredient(ing.id, { amount: Number(e.target.value) })} 
            />
           
           <select 
              value={ing.unit} 
              onChange={e => updateIngredient(ing.id, { unit: e.target.value as Unit })}
            >
              
              <option value="г">г</option>
              <option value="мл">мл</option>
              <option value="шт">шт</option>
              <option value="ч.л.">ч.л.</option>
              <option value="ст.л.">ст.л.</option>
            </select>
            <button onClick={() => setRecipe(prev => ({ ...prev, ingredients: prev.ingredients.filter(i => i.id !== ing.id) }))}>✕</button>
          </div>
        ))}
        <button className="btn-add" onClick={addIngredient}>+ Додати інгредієнт</button>
      </div>

      <div className="section">
        <h3>Кроки приготування</h3>
        {recipe.steps.map((step, index) => (
          <div key={step.id} className="step-editor">
            <div className="step-header">
              <span>Крок {index + 1}</span>
              <button onClick={() => setRecipe(prev => ({ ...prev, steps: prev.steps.filter(s => s.id !== step.id) }))}>Видалити</button>
            </div>
            <textarea 
              placeholder="Що робити..."
              value={step.description}
              onChange={e => updateStep(step.id, { description: e.target.value })}
            />
            
            <div className="step-actions">
               <input 
                type="number" 
                placeholder="Таймер (сек)"
                min="1"
                value={step.timerSeconds || ''}
                onChange={e => updateStep(step.id, { timerSeconds: e.target.value ? Math.max(1, Number(e.target.value)) : null })}
              />

              <div className="ingredient-select">
                <p>Використовувані інгредієнти:</p>
                <div className="ingredient-grid">
                  {recipe.ingredients.map(ing => {
                    const isSelected = step.ingredientIds.includes(ing.id);
                    const isDisabled = ing.name.trim() === '';
                    
                    return (
                      <label 
                        key={ing.id} 
                        className={`ingredient-checkbox-label ${isSelected ? 'active' : ''} ${isDisabled ? 'disabled' : ''}`}
                      >
                        <input 
                          type="checkbox"
                          disabled={isDisabled}
                          checked={isSelected && !isDisabled}
                          onChange={e => {
                            const newIds = e.target.checked 
                              ? [...step.ingredientIds, ing.id]
                              : step.ingredientIds.filter(id => id !== ing.id);
                            updateStep(step.id, { ingredientIds: newIds });
                          }}
                        />
                        <span>{ing.name || 'Пуста назва'}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        ))}
        <button className="btn-add" onClick={addStep}>+ Додати крок</button>
      </div>
    </div>
  );
};