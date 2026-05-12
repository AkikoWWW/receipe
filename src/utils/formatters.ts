const STEP_LABELS = [
    'Перший', 'Другий', 'Третій', 'Четвертий', 'П’ятий', 
    'Шостий', 'Сьомий', 'Восьмий', 'Дев’ятий', 'Десятий'
  ];
  
  export const formatStepTitle = (index: number): string => {
    const label = STEP_LABELS[index] || `${index + 1}-й`;
    return `Крок ${label.toLowerCase()}`;
  };