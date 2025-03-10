import React, { useState } from 'react';

interface NavItem {
  id: string;
  name: string;
  icon: React.ReactNode;
  path: string;
  badge?: number;
}

interface User {
  id: string;
  name: string;
  email: string;
  churchName: string;
  role: string;
}

interface SidebarProps {
  items: NavItem[];
  activeItemId?: string;
  onItemClick: (item: NavItem) => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  onLogout?: () => void;
  user?: User | null;
}

const Sidebar: React.FC<SidebarProps> = ({
  items,
  activeItemId,
  onItemClick,
  isCollapsed = false,
  onToggleCollapse,
  onLogout,
  user,
}) => {
  return (
    <div
      className={`bg-white shadow-md h-screen transition-all duration-300 ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      <div className="p-4 border-b border-neutral-200 flex items-center justify-between">
        {!isCollapsed && (
          <h1 className="text-xl font-bold text-primary-800">Church Planner</h1>
        )}
        {isCollapsed && (
          <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-800 font-bold mx-auto">
            C
          </div>
        )}
        {onToggleCollapse && (
          <button
            onClick={onToggleCollapse}
            className="text-neutral-400 hover:text-neutral-600"
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              {isCollapsed ? (
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              ) : (
                <path
                  fillRule="evenodd"
                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              )}
            </svg>
          </button>
        )}
      </div>
      
      <nav className="p-2">
        <ul className="space-y-1">
          {items.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => onItemClick(item)}
                className={`w-full flex items-center p-2 rounded-md transition-colors ${
                  activeItemId === item.id
                    ? 'bg-primary-100 text-primary-800'
                    : 'text-neutral-600 hover:bg-neutral-100'
                }`}
              >
                <div className="flex-shrink-0">{item.icon}</div>
                
                {!isCollapsed && (
                  <div className="ml-3 flex-grow text-left">{item.name}</div>
                )}
                
                {!isCollapsed && item.badge !== undefined && (
                  <div className="ml-auto bg-primary-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {item.badge > 9 ? '9+' : item.badge}
                  </div>
                )}
              </button>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="absolute bottom-0 w-full p-4 border-t border-neutral-200">
        {user ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-800 font-medium">
                {user.name.charAt(0)}
              </div>
              
              {!isCollapsed && (
                <div className="ml-3">
                  <p className="text-sm font-medium text-neutral-900">{user.name}</p>
                  <p className="text-xs text-neutral-500">{user.role}</p>
                </div>
              )}
            </div>
            
            {!isCollapsed && onLogout && (
              <button
                onClick={onLogout}
                className="text-neutral-400 hover:text-neutral-600"
                aria-label="Logout"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V4a1 1 0 00-1-1H3zm11 4a1 1 0 10-2 0v4a1 1 0 102 0V7zm-8 1a1 1 0 00-1 1v2a1 1 0 001 1h3a1 1 0 100-2H7V9a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            )}
          </div>
        ) : (
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-neutral-200 flex items-center justify-center text-neutral-600 font-medium">
              ?
            </div>
            
            {!isCollapsed && (
              <div className="ml-3">
                <p className="text-sm font-medium text-neutral-900">Guest User</p>
                <p className="text-xs text-neutral-500">Not logged in</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar; 