// Promoted / sponsored content components for Davinci.
// Three form factors:
//   <FeedAd>     — inline in the main feed (full post-width card)
//   <RailAd>     — compact tile for right/left rails
//   <InlineAd>   — thin banner row, for between list items (Jobs, Alerts)
// All three share the "promoted" meta line and the advertiser chip,
// so the pattern is recognizable across surfaces.

function PromotedMeta({ advertiser, subtitle, logoInitials, logoVariant = 'g5' }) {
  return (
    <div style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '12px 16px 0' }}>
      <Avatar initials={logoInitials} size={40} variant={logoVariant} style={{ borderRadius: 8 }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 600, fontFamily: 'var(--font-display)' }}>{advertiser}</div>
        <div className="meta" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {subtitle} <span className="dot-sep" /> <span>Promoted</span>
        </div>
      </div>
      <Button variant="ghost" size="sm" style={{ padding: 4 }} icon="close" />
    </div>
  );
}

function FeedAd({ ad }) {
  return (
    <section className="panel ad ad--feed" aria-label="Sponsored content">
      <PromotedMeta
        advertiser={ad.advertiser}
        subtitle={ad.followers}
        logoInitials={ad.logo}
        logoVariant={ad.logoVariant}
      />
      <div style={{ padding: '10px 16px 14px', fontSize: 14, lineHeight: 1.55 }}>
        {ad.hook}
      </div>
      <div className="ad__creative" style={{
        height: 220,
        background: ad.creative || 'linear-gradient(135deg, var(--blue-8), var(--blue-10))',
        borderTop: '1px solid var(--border-subtle)',
        borderBottom: '1px solid var(--border-subtle)',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex', alignItems: 'flex-end',
      }}>
        {ad.creativeOverlay}
      </div>
      <div style={{
        padding: '12px 16px',
        display: 'flex', alignItems: 'center', gap: 12,
        background: 'var(--bg-subtle)',
      }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 600, fontFamily: 'var(--font-display)' }}>{ad.title}</div>
          <div className="meta">{ad.domain}</div>
        </div>
        <Button variant="outline" size="sm" pill iconRight="arrow_forward">{ad.cta}</Button>
      </div>
    </section>
  );
}

function RailAd({ ad }) {
  return (
    <section className="panel ad ad--rail" aria-label="Sponsored content">
      <div style={{
        height: 96,
        background: ad.creative || 'linear-gradient(135deg, var(--yellow-7), var(--yellow-10))',
        position: 'relative',
      }}>
        <div style={{
          position: 'absolute', top: 8, right: 8,
          background: 'rgba(0,0,0,.4)', color: '#fff',
          fontSize: 10, fontWeight: 600, letterSpacing: '0.04em',
          padding: '2px 6px', borderRadius: 4, textTransform: 'uppercase',
        }}>Promoted</div>
      </div>
      <div style={{ padding: '12px 14px' }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
          <Avatar initials={ad.logo} size={32} variant={ad.logoVariant || 'g5'} style={{ borderRadius: 6 }} />
          <div style={{ fontSize: 12, fontWeight: 600, fontFamily: 'var(--font-display)', minWidth: 0 }}>
            <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{ad.advertiser}</div>
          </div>
        </div>
        <div style={{ fontSize: 12, lineHeight: 1.45, color: 'var(--fg)', marginBottom: 10 }}>
          {ad.hook}
        </div>
        <Button variant="outline" size="sm" pill style={{ width: '100%' }}>{ad.cta}</Button>
      </div>
    </section>
  );
}

function InlineAd({ ad }) {
  return (
    <div className="ad ad--inline" role="complementary" aria-label="Sponsored" style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '12px 16px',
      background: 'var(--bg-subtle)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 10,
    }}>
      <Avatar initials={ad.logo} size={40} variant={ad.logoVariant || 'g5'} style={{ borderRadius: 6 }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 13, fontWeight: 600, fontFamily: 'var(--font-display)' }}>{ad.advertiser}</span>
          <span style={{
            fontSize: 10, fontWeight: 700, letterSpacing: '0.06em',
            color: 'var(--fg-muted)', textTransform: 'uppercase',
            padding: '1px 6px', border: '1px solid var(--border-subtle)',
            borderRadius: 4,
          }}>Promoted</span>
        </div>
        <div style={{ fontSize: 12, color: 'var(--fg-muted)', marginTop: 2, lineHeight: 1.4 }}>
          {ad.hook}
        </div>
      </div>
      <Button variant="outline" size="sm" pill>{ad.cta}</Button>
    </div>
  );
}

// Ad library — realistic-looking fake advertisers
const AD_LIBRARY = {
  notion: {
    advertiser: 'Atlas Docs',
    followers: '214,882 followers',
    logo: 'A',
    logoVariant: 'g5',
    hook: 'Your team\'s knowledge, but it actually stays up to date. Atlas AI rewrites stale docs in place, flags conflicts, and learns your team\'s voice.',
    title: 'Start a 30-day pilot for your team',
    domain: 'atlasdocs.com · Sponsored',
    creative: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
    cta: 'Learn more',
    creativeOverlay: (
      <div style={{
        padding: 24, width: '100%',
        display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 16, alignItems: 'center',
      }}>
        <div style={{
          width: 72, height: 72, borderRadius: 12,
          background: 'linear-gradient(135deg, var(--blue-7), var(--blue-9))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 36,
        }}>A</div>
        <div style={{ color: '#fff' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 22, letterSpacing: '-0.02em' }}>
            Docs that write themselves
          </div>
          <div style={{ fontSize: 13, opacity: .7, marginTop: 4 }}>
            Free for teams under 10 · No credit card
          </div>
        </div>
      </div>
    ),
  },
  figma: {
    advertiser: 'Frame Design Tools',
    followers: '1.2M followers',
    logo: 'F',
    logoVariant: 'g4',
    hook: 'Frame 2026 is here. Real-time cursors, vector networks, and AI-assisted specs — all in one collaborative canvas.',
    title: 'Try Frame 2026 free',
    domain: 'frame.design · Sponsored',
    cta: 'Get started',
    creative: 'linear-gradient(135deg, #a23289 0%, #d14b92 100%)',
    creativeOverlay: (
      <div style={{
        padding: 24, width: '100%', color: '#fff',
      }}>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 26, letterSpacing: '-0.02em', lineHeight: 1.1 }}>
          Design, prototype,<br /> and spec — together.
        </div>
        <div style={{ marginTop: 10, opacity: .85, fontSize: 13 }}>
          Free for up to 5 editors.
        </div>
      </div>
    ),
  },
  zoom: {
    advertiser: 'Pulse Meetings',
    followers: '84,320 followers',
    logo: 'P',
    logoVariant: 'g2',
    hook: 'Smarter meetings, fewer of them. Pulse AI drafts the agenda, transcribes, and files action items before you close the tab.',
    title: 'Free for teams under 20',
    domain: 'pulse.co · Sponsored',
    cta: 'Start free',
    creative: 'linear-gradient(135deg, var(--yellow-7), var(--yellow-10))',
    creativeOverlay: (
      <div style={{
        padding: 24, width: '100%',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
      }}>
        <div style={{ color: '#1a1500' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 22, letterSpacing: '-0.02em' }}>
            Cut your meetings by 30%
          </div>
          <div style={{ fontSize: 13, opacity: .75, marginTop: 4 }}>
            An AI co-host for every call
          </div>
        </div>
      </div>
    ),
  },
  linear: {
    advertiser: 'Vector Project OS',
    followers: '42,112 followers',
    logo: 'V',
    logoVariant: 'g1',
    hook: 'Issue tracking built for teams who ship. Keyboard-first, instant search, no bloat.',
    title: 'See why engineers prefer Vector',
    domain: 'vector.dev · Sponsored',
    cta: 'Try free',
    creative: 'linear-gradient(135deg, #5b6cff 0%, #3a47bf 100%)',
    creativeOverlay: (
      <div style={{ padding: 24, width: '100%', color: '#fff' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, opacity: .7 }}>ENG-2481</div>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 20, marginTop: 6 }}>
          "Vector replaced four tools for us."
        </div>
      </div>
    ),
  },
  // Compact entries for rail / inline
  aws: {
    advertiser: 'Skyline Cloud',
    logo: 'S',
    logoVariant: 'g5',
    hook: 'Ship to every region without a DevOps team. $300 credit for new orgs.',
    cta: 'Claim credit',
    creative: 'linear-gradient(135deg, #246b64, #3ea889)',
  },
  course: {
    advertiser: 'Craft School',
    logo: 'CS',
    logoVariant: 'g4',
    hook: '6-week cohort on design systems. Led by staff designers from Helix & Pylon.',
    cta: 'Apply',
    creative: 'linear-gradient(135deg, #7c4a1f, #c0864f)',
  },
  recruit: {
    advertiser: 'Helix Systems',
    logo: 'HX',
    logoVariant: 'g2',
    hook: 'Hiring design engineers across EU timezones. Remote-first, 4-day week.',
    cta: 'View roles',
    creative: 'linear-gradient(135deg, var(--blue-7), var(--blue-9))',
  },
};

Object.assign(window, { FeedAd, RailAd, InlineAd, AD_LIBRARY });
