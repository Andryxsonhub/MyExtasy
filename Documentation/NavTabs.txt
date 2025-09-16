// src/components/NavTabs.tsx

import React from 'react';
import { NavLink } from 'react-router-dom';

interface NavTabsProps {
  categories: { name: string; link: string }[];
}

// Renomeado para NavTabs
const NavTabs: React.FC<NavTabsProps> = ({ categories }) => {
  return (
    <nav className="bg-background border-b border-border py-2">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center space-x-6">
          {categories.map((category) => (
            <NavLink
              key={category.name}
              to={category.link}
              className={({ isActive }) =>
                `text-sm font-medium transition-colors hover:text-primary ${
                  isActive ? 'text-primary' : 'text-gray-400'
                }`
              }
            >
              {category.name}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
};

// Renomeado para NavTabs
export default NavTabs;