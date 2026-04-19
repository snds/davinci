import React from 'react';

function Panel({ title, action, children, style, bodyStyle }) {
  return (
    <section className="panel" style={style}>
      {(title || action) && (
        <header className="panel__header">
          <span>{title}</span>
          {action}
        </header>
      )}
      <div className="panel__body" style={bodyStyle}>{children}</div>
    </section>
  );
}

export default Panel;
