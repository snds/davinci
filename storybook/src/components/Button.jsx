import React from 'react';
import Icon from './Icon';

function Button({ variant = 'secondary', size, pill, children, onClick, icon, iconRight, style }) {
  const cls = [
    'btn',
    `btn--${variant}`,
    size === 'sm' && 'btn--sm',
    pill && 'btn--pill',
  ].filter(Boolean).join(' ');

  return (
    <button className={cls} onClick={onClick} style={style}>
      {icon && <Icon name={icon} style={{ fontSize: 16 }} />}
      {children}
      {iconRight && <Icon name={iconRight} style={{ fontSize: 16 }} />}
    </button>
  );
}

export default Button;
