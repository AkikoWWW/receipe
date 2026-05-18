import React from 'react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { SortableStepItem } from './SortableStepItem';
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

  const removeStep = (id: string) => {
    setRecipe(prev => ({
      ...prev,
      steps: prev.steps.filter(s => s.id !== id)
    }));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      setRecipe(prev => {
        const oldIndex = prev.steps.findIndex(s => s.id === active.id);
        const newIndex = prev.steps.findIndex(s => s.id === over.id);
        
        return {
          ...prev,
          steps: arrayMove(prev.steps, oldIndex, newIndex)
        };
      });
    }
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
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={recipe.steps.map(s => s.id)} strategy={verticalListSortingStrategy}>
            {recipe.steps.map((step, index) => (
              <SortableStepItem
                key={step.id}
                step={step}
                index={index}
                ingredients={recipe.ingredients}
                onUpdateStep={updateStep}
                onRemoveStep={removeStep}
              />
            ))}
          </SortableContext>
        </DndContext>
        <button className="btn-add" onClick={addStep}>+ Додати крок</button>
      </div>
    </div>
  );
};