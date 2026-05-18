import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { RecipeStep, Ingredient } from '../../types/recipe';

interface SortableStepItemProps {
  step: RecipeStep;
  index: number;
  ingredients: Ingredient[];
  onUpdateStep: (id: string, data: Partial<RecipeStep>) => void;
  onRemoveStep: (id: string) => void;
}

export const SortableStepItem: React.FC<SortableStepItemProps> = ({
  step,
  index,
  ingredients,
  onUpdateStep,
  onRemoveStep,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: step.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const isSelected = (ingId: string) => step.ingredientIds.includes(ingId);

  return (
    <div ref={setNodeRef} style={style} className="step-editor">
      <div className="step-header">
        <div className="step-header-left">
          <span className="drag-handle" {...attributes} {...listeners}>☰</span>
          <span className="step-title">Крок {index + 1}</span>
        </div>
        <button className="btn-delete" onClick={() => onRemoveStep(step.id)}>Видалити</button>
      </div>
      
      <textarea 
        placeholder="Що робити..."
        value={step.description}
        onChange={e => onUpdateStep(step.id, { description: e.target.value })}
      />
      
      <div className="step-actions">
        <input 
          type="number" 
          placeholder="Таймер (сек)"
          min="1"
          value={step.timerSeconds || ''}
          onChange={e => onUpdateStep(step.id, { timerSeconds: e.target.value ? Math.max(1, Number(e.target.value)) : null })}
        />

        <div className="ingredient-select">
          <p>Використовуваемые інгредієнти:</p>
          <div className="ingredient-grid">
            {ingredients.map(ing => {
              const checked = isSelected(ing.id);
              const isDisabled = ing.name.trim() === '';
              
              return (
                <label 
                  key={ing.id} 
                  className={`ingredient-checkbox-label ${checked ? 'active' : ''} ${isDisabled ? 'disabled' : ''}`}
                >
                  <input 
                    type="checkbox"
                    disabled={isDisabled}
                    checked={checked && !isDisabled}
                    onChange={e => {
                      const newIds = e.target.checked 
                        ? [...step.ingredientIds, ing.id]
                        : step.ingredientIds.filter(id => id !== ing.id);
                      onUpdateStep(step.id, { ingredientIds: newIds });
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
  );
};