import React, { useState, useEffect, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import type { Recipe } from './types/recipe';
import { Editor } from './components/Editor/Editor';
import { Preview } from './components/Preview/Preview';
import { encodeRecipe, decodeRecipe } from './utils/share';
import './styles/global.css';

const DEFAULT_RECIPE: Recipe = {
  title: '',
  servings: 1,
  ingredients: [],
  steps: []
};

const App: React.FC = () => {
  const [recipe, setRecipe] = useState<Recipe>(() => {
    const params = new URLSearchParams(window.location.search);
    const shared = params.get('recipe');
    
    if (shared) {
      const decoded = decodeRecipe(shared);
      if (decoded) return decoded;
    }
    
    const saved = localStorage.getItem('recipe_draft');
    return saved ? JSON.parse(saved) : DEFAULT_RECIPE;
  });

  const [activeTab, setActiveTab] = useState<'edit' | 'view'>('edit');
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem('recipe_draft', JSON.stringify(recipe));
  }, [recipe]);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: recipe.title || 'Recipe'
  });

  const handleShare = () => {
    const hash = encodeRecipe(recipe);
    const url = `${window.location.origin}${window.location.pathname}?recipe=${hash}`;
    navigator.clipboard.writeText(url);
    alert('Посилання скопійовано!');
  };

  const handleNewRecipe = () => {
    if (window.confirm('Очистити поточний рецепт?')) {
      setRecipe(DEFAULT_RECIPE);
      window.history.replaceState({}, '', window.location.pathname);
    }
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1>Recipe Builder</h1>
        <div className="header-actions">
          <button onClick={handleNewRecipe}>Новий рецепт</button>
          <button onClick={handleShare}>Поділитися</button>
          <button onClick={() => handlePrint()} className="primary">Зберегти PDF</button>
        </div>
      </header>

      <main className={`main-layout ${activeTab}`}>
        <section className="editor-section">
          <Editor recipe={recipe} setRecipe={setRecipe} />
        </section>
        
        {}
        <section className="preview-section" ref={printRef}>
          <Preview recipe={recipe} />
        </section>
      </main>
    </div>
  );
};

export default App;