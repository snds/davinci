// Profile page

function ProfilePage({ onBack }) {
  return (
    <main className="stack">
      <section className="panel" style={{ overflow: 'hidden' }}>
        <div
          className="profile-cover"
          style={{
            backgroundImage: `url(${seededPhoto('yara-okonkwo-banner', 1200, 360, 'banner')})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        ></div>
        <div className="profile-header">
          <Avatar initials="YO" size={128} variant="g1" photo={seededPhoto('yara-okonkwo', 256, 256, 'face')} />
          <div className="profile-header__name">Yara Okonkwo</div>
          <div className="profile-header__headline">
            Principal Designer at Davinci Systems · Helping teams build design infrastructure that doesn't rot.
          </div>
          <div className="profile-header__meta">
            <span><Icon name="location_on" style={{ fontSize: 14 }} /> Lisbon, Portugal</span>
            <span><Icon name="group" style={{ fontSize: 14 }} /> 1,842 connections · 12k followers</span>
          </div>
          <div className="profile-header__actions">
            <Button variant="primary" icon="chat_bubble">Message</Button>
            <Button variant="outline" icon="add">Follow</Button>
            <Button variant="secondary">More</Button>
          </div>
        </div>
      </section>

      <Panel title="About">
        <p style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--fg-muted)', margin: 0 }}>
          Designer and systems thinker with 12 years of experience building design infrastructure for product teams.
          I care about the boring, load-bearing parts of design systems — tokens, governance, contribution models —
          because those are what make every other part of design work feel easy.
        </p>
        <div className="entry__skills" style={{ marginTop: 14 }}>
          <Pill variant="accent">Design Systems</Pill>
          <Pill variant="accent">Typography</Pill>
          <Pill variant="accent">Accessibility</Pill>
          <Pill>Figma</Pill>
          <Pill>React</Pill>
          <Pill>CSS</Pill>
          <Pill>Product Strategy</Pill>
        </div>
      </Panel>

      <Panel title="Experience">
        {[
          { logo: 'DV', co: 'Davinci Systems', title: 'Principal Designer', time: '2022 – Present · 4 yrs', desc: 'Lead design system and brand systems across the Davinci product suite. Built a token pipeline that 40+ product teams now consume.', skills: ['Design Systems', 'Tokens', 'Leadership'] },
          { logo: 'HX', co: 'Helix', title: 'Senior Product Designer', time: '2019 – 2022 · 3 yrs', desc: 'Owned end-to-end redesign of the primary dashboard; partnered with eng on a React component library that replaced a decade-old CSS framework.', skills: ['Product Design', 'React', 'Figma'] },
          { logo: 'NV', co: 'Novatech', title: 'Product Designer', time: '2015 – 2019 · 4 yrs', desc: 'Shipped consumer-facing features across web and iOS. Built the first internal component library.', skills: ['iOS', 'Web'] },
        ].map((e, i) => (
          <div key={i} className="entry">
            <div className="entry__logo">{e.logo}</div>
            <div style={{ flex: 1 }}>
              <div className="entry__title">{e.title}</div>
              <div className="entry__sub">{e.co}</div>
              <div className="entry__time">{e.time}</div>
              <div className="entry__desc">{e.desc}</div>
              <div className="entry__skills">
                {e.skills.map(s => <Pill key={s}>{s}</Pill>)}
              </div>
            </div>
          </div>
        ))}
      </Panel>

      <Panel title="Education">
        <div className="entry">
          <div className="entry__logo">RC</div>
          <div>
            <div className="entry__title">Royal College of Art</div>
            <div className="entry__sub">MA Communication Design</div>
            <div className="entry__time">2013 – 2015</div>
          </div>
        </div>
      </Panel>
    </main>
  );
}

Object.assign(window, { ProfilePage });
