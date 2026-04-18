import React, { useState } from 'react';

const PORTRAIT_MAP = {
  'yara okonkwo':   'photo-1531123897727-8f129e1688ce',
  'sofia antonova': 'photo-1544005313-94ddf0286df2',
  'daniel amrani':  'photo-1507003211169-0a1dd7228f2d',
  'priya ravi':     'photo-1580489944761-15a19d654956',
  'miriam chen':    'photo-1573496359142-b8d87734a5a2',
  'ines caballero': 'photo-1534528741775-53994a69daeb',
  'kai thornton':   'photo-1472099645785-5658abf4ff4e',
  'noor farsi':     'photo-1548142813-c348350df52b',
  'lena brandt':    'photo-1438761681033-6461ffad8d80',
  'ore adebayo':    'photo-1506794778202-cad84cf45f1d',
  'tara weiss':     'photo-1554151228-14d9def656e4',
  'marcus lind':    'photo-1492562080023-ab3db95bfbce',
  'jude abara':     'photo-1519085360753-af0119f7cbe7',
  'emeline roux':   'photo-1494790108377-be9c29b29330',
  'sofia nakamura': 'photo-1517365830460-955ce3ccd263',
  'sonya petersen': 'photo-1487412720507-e7ab37603c6f',
  'solomon reyes':  'photo-1500648767791-00dcc994a43e',
};

function hashCode(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

const FALLBACK_PORTRAITS = [
  'photo-1502823403499-6ccfcf4fb453', 'photo-1506794778202-cad84cf45f1d',
  'photo-1534528741775-53994a69daeb', 'photo-1580489944761-15a19d654956',
  'photo-1507003211169-0a1dd7228f2d', 'photo-1508214751196-bcfd4ca60f91',
  'photo-1573496359142-b8d87734a5a2', 'photo-1517841905240-472988babdf9',
  'photo-1438761681033-6461ffad8d80', 'photo-1519085360753-af0119f7cbe7',
  'photo-1544005313-94ddf0286df2',   'photo-1531123897727-8f129e1688ce',
];

export function seededPhoto(seed, w = 200, h = 200, kind = 'face') {
  const safe = String(seed).toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'x';
  if (kind === 'face') {
    const lookupKey = String(seed).toLowerCase()
      .replace(/-banner$|-avatar$/, '')
      .replace(/[^a-z0-9]+/g, ' ')
      .trim();
    const photoId = PORTRAIT_MAP[lookupKey]
      || FALLBACK_PORTRAITS[hashCode(safe) % FALLBACK_PORTRAITS.length];
    const size = Math.max(w, h);
    return `https://images.unsplash.com/${photoId}?w=${size}&h=${size}&fit=crop&crop=faces&auto=format&q=75`;
  }
  const prefix = kind === 'banner' ? 'b-' : kind === 'article' ? 'a-' : kind === 'office' ? 'o-' : '';
  return `https://picsum.photos/seed/${prefix}${safe}/${w}/${h}`;
}

export function maybePhoto(seed, w = 200, h = 200) {
  return seededPhoto(seed, w, h, 'face');
}

function Avatar({ initials, size = 40, variant = 'g1', photo, photoSeed, style }) {
  const [broken, setBroken] = useState(false);

  let resolved = null;
  if (photo === null) resolved = null;
  else if (typeof photo === 'string') resolved = photo;
  else if (photoSeed) resolved = maybePhoto(photoSeed, size * 2, size * 2);

  const showPhoto = resolved && !broken;

  return (
    <div
      className={`avatar avatar--${size} avatar--${variant}`}
      style={style}
    >
      {showPhoto ? (
        <img
          src={resolved}
          alt=""
          loading="lazy"
          onError={() => setBroken(true)}
          style={{
            width: '100%', height: '100%', objectFit: 'cover',
            borderRadius: 'inherit', display: 'block',
          }}
        />
      ) : initials}
    </div>
  );
}

export default Avatar;
