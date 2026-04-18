import React from 'react';
import Icon from './Icon';

function NavList({ items, activeId }) {
  const defaultItems = [
    { id: 'saved', icon: 'bookmark', label: 'Saved items' },
    { id: 'groups', icon: 'groups', label: 'Groups', count: 12 },
    { id: 'events', icon: 'event', label: 'Events' },
    { id: 'newsletters', icon: 'newspaper', label: 'Newsletters' },
    { id: 'recent', icon: 'history', label: 'Recent' },
  ];

  const navItems = items || defaultItems;

  return (
    <ul className="nav-list">
      {navItems.map((item) => (
        <li key={item.id} className={activeId === item.id ? 'active' : ''}>
          <Icon name={item.icon} />
          {item.label}
          {item.count != null && <span className="count">{item.count}</span>}
        </li>
      ))}
    </ul>
  );
}

export default NavList;
