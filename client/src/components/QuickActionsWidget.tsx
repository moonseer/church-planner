import React from 'react';

interface Action {
  id: string;
  name: string;
  icon: React.ReactNode;
  onClick: () => void;
}

interface QuickActionsWidgetProps {
  actions: Action[];
}

const QuickActionsWidget: React.FC<QuickActionsWidgetProps> = ({ actions }) => {
  return (
    <div className="grid grid-cols-2 gap-3">
      {actions.map((action) => (
        <button
          key={action.id}
          onClick={action.onClick}
          className="flex flex-col items-center justify-center p-4 bg-neutral-50 rounded-md border border-neutral-200 hover:bg-neutral-100 transition-colors"
        >
          <div className="text-primary-600 mb-2">{action.icon}</div>
          <span className="text-sm font-medium text-neutral-900">{action.name}</span>
        </button>
      ))}
    </div>
  );
};

export default QuickActionsWidget; 