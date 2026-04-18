import React from 'react';
import Avatar from './Avatar';
import { seededPhoto } from './Avatar';
import Button from './Button';
import Panel from './Panel';
import Icon from './Icon';

function RightRail() {
  const news = [
    { t: 'AI tools reshape the design stack', sub: '4h ago · 8,204 readers' },
    { t: 'Typography on the web, revisited', sub: '6h ago · 3,102 readers' },
    { t: 'Remote-first companies hit new peak', sub: '12h ago · 12k readers' },
    { t: 'Product orgs lean into async rituals', sub: '1d ago · 5,608 readers' },
  ];

  return (
    <aside>
      <Panel
        title="Davinci News"
        action={<Icon name="info" style={{ color: 'var(--fg-subtle)', fontSize: 16 }} />}
        bodyStyle={{ padding: 0 }}
      >
        {news.map((n, i) => (
          <div key={i} className="rail-item" style={{ alignItems: 'flex-start' }}>
            <div style={{ width: 6, height: 6, borderRadius: 3, background: 'var(--fg-muted)', marginTop: 7 }} />
            <div className="rail-item__text">
              <div className="rail-item__title">{n.t}</div>
              <div className="rail-item__sub">{n.sub}</div>
            </div>
          </div>
        ))}
      </Panel>

      <Panel title="People to follow" bodyStyle={{ padding: 0 }}>
        {[
          { n: 'Miriam Chen', r: 'VP Design · Helix', i: 'MC', v: 'g4' },
          { n: 'Daniel Amrani', r: 'Head of Brand · Pylon', i: 'DA', v: 'g2' },
          { n: 'Priya Ravi', r: 'Design Engineer · Atlas', i: 'PR', v: 'g5' },
        ].map((p, i) => (
          <div key={i} className="rail-item">
            <Avatar initials={p.i} size={40} variant={p.v} photo={seededPhoto(p.n, 80, 80, 'face')} />
            <div className="rail-item__text">
              <div className="rail-item__title">{p.n}</div>
              <div className="rail-item__sub">{p.r}</div>
            </div>
            <Button variant="outline" size="sm" pill icon="add">Follow</Button>
          </div>
        ))}
      </Panel>
    </aside>
  );
}

export default RightRail;
