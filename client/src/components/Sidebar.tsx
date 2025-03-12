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
  firstName?: string;
  lastName?: string;
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
  // Get the user's initials or a fallback
  const getUserInitial = () => {
    if (!user || !user.name) return '?';
    return user.name.charAt(0).toUpperCase();
  };

  // Get the display name or a fallback
  const getDisplayName = () => {
    if (!user) return 'Guest User';
    return user.name || 'User';
  };

  // Get the role or a fallback
  const getRole = () => {
    if (!user) return 'Not logged in';
    return user.role || 'User';
  };

  return (
    <div
      className={`bg-white shadow-md h-screen flex flex-col transition-all duration-300 ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Header */}
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
      
      {/* User Profile - Moved to top for better visibility */}
      {user && (
        <div className="p-3 border-b border-neutral-200">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-800 font-medium">
              {getUserInitial()}
            </div>
            
            {!isCollapsed && (
              <div className="ml-3 flex-grow">
                <p className="text-sm font-medium text-neutral-900">{getDisplayName()}</p>
                <p className="text-xs text-neutral-500">{getRole()}</p>
              </div>
            )}
          </div>
          
          {/* Logout Button - Visible under profile */}
          {!isCollapsed && onLogout && (
            <button
              onClick={onLogout}
              className="mt-2 w-full flex items-center justify-center p-1.5 rounded bg-red-50 text-red-600 hover:bg-red-100 transition-colors text-sm"
              aria-label="Logout"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V4a1 1 0 00-1-1H3zm7 12.59L5.41 11H9V9H5.41L10 4.41V7h2V4.41L16.59 9H13v2h3.59L12 15.59V13h-2v2.59z"
                  clipRule="evenodd"
                />
              </svg>
              Logout
            </button>
          )}
        </div>
      )}
      
      {/* Navigation */}
      <nav className="p-2 flex-grow overflow-y-auto">
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
      
      {/* Footer with Logout Icon for collapsed view */}
      {isCollapsed && user && onLogout && (
        <div className="p-2 border-t border-neutral-200">
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center p-2 rounded-md text-red-500 hover:bg-red-50 transition-colors"
            aria-label="Logout"
            title="Logout"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V4a1 1 0 00-1-1H3zm7 12.59L5.41 11H9V9H5.41L10 4.41V7h2V4.41L16.59 9H13v2h3.59L12 15.59V13h-2v2.59z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default Sidebar; 