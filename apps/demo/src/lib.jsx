import * as React from "react";

import { Button as UIButton } from "@davinci/ui/components/ui/button";
import {
  Avatar as UIAvatar,
  AvatarImage,
  AvatarFallback,
} from "@davinci/ui/components/ui/avatar";
import { Badge } from "@davinci/ui/components/ui/badge";
import { Card } from "@davinci/ui/components/ui/card";

/* ---------------- Icon (Material Symbols Rounded) ---------------- */
export function Icon({ name, filled, style, className = "" }) {
  return (
    <span
      className={`material-symbols-rounded ${filled ? "filled" : ""} ${className}`}
      style={style}
      aria-hidden
    >
      {name}
    </span>
  );
}

/* ---------------- Seeded portraits (ported from the original demo) ---------------- */
const PORTRAIT_MAP = {
  "yara okonkwo": "photo-1531123897727-8f129e1688ce",
  "sofia antonova": "photo-1544005313-94ddf0286df2",
  "daniel amrani": "photo-1507003211169-0a1dd7228f2d",
  "priya ravi": "photo-1580489944761-15a19d654956",
  "miriam chen": "photo-1573496359142-b8d87734a5a2",
  "ines caballero": "photo-1534528741775-53994a69daeb",
  "kai thornton": "photo-1472099645785-5658abf4ff4e",
  "noor farsi": "photo-1548142813-c348350df52b",
  "lena brandt": "photo-1438761681033-6461ffad8d80",
  "ore adebayo": "photo-1506794778202-cad84cf45f1d",
  "tara weiss": "photo-1554151228-14d9def656e4",
  "marcus lind": "photo-1492562080023-ab3db95bfbce",
  "jude abara": "photo-1519085360753-af0119f7cbe7",
  "emeline roux": "photo-1494790108377-be9c29b29330",
  "sofia nakamura": "photo-1517365830460-955ce3ccd263",
  "sonya petersen": "photo-1487412720507-e7ab37603c6f",
  "solomon reyes": "photo-1500648767791-00dcc994a43e",
};
const FALLBACK_PORTRAITS = [
  "photo-1502823403499-6ccfcf4fb453", "photo-1506794778202-cad84cf45f1d",
  "photo-1534528741775-53994a69daeb", "photo-1580489944761-15a19d654956",
  "photo-1507003211169-0a1dd7228f2d", "photo-1508214751196-bcfd4ca60f91",
  "photo-1573496359142-b8d87734a5a2", "photo-1517841905240-472988babdf9",
  "photo-1438761681033-6461ffad8d80", "photo-1519085360753-af0119f7cbe7",
  "photo-1544005313-94ddf0286df2", "photo-1531123897727-8f129e1688ce",
];
function hashCode(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}
export function seededPhoto(seed, w = 200, h = 200, kind = "face") {
  const safe = String(seed).toLowerCase().replace(/[^a-z0-9]+/g, "-") || "x";
  if (kind === "face") {
    const lookupKey = String(seed).toLowerCase()
      .replace(/-banner$|-avatar$/, "").replace(/[^a-z0-9]+/g, " ").trim();
    const id = PORTRAIT_MAP[lookupKey] || FALLBACK_PORTRAITS[hashCode(safe) % FALLBACK_PORTRAITS.length];
    const size = Math.max(w, h);
    return `https://images.unsplash.com/${id}?w=${size}&h=${size}&fit=crop&crop=faces&auto=format&q=75`;
  }
  const prefix = kind === "banner" ? "b-" : kind === "article" ? "a-" : kind === "office" ? "o-" : "";
  return `https://picsum.photos/seed/${prefix}${safe}/${w}/${h}`;
}
export function maybePhoto(seed, w = 200, h = 200) {
  return seededPhoto(seed, w, h, "face");
}

/* ---------------- Button (wraps @davinci/ui Button, keeps demo's API) ---------------- */
export function Button({
  variant = "secondary", size, pill, children, onClick, icon, iconRight, style, className = "", ...rest
}) {
  return (
    <UIButton
      variant={variant}
      size={size || "default"}
      onClick={onClick}
      style={style}
      className={`${pill ? "btn--pill" : ""} ${className}`.trim()}
      {...rest}
    >
      {icon && <Icon name={icon} className="text-[16px]" />}
      {children}
      {iconRight && <Icon name={iconRight} className="text-[16px]" />}
    </UIButton>
  );
}

/* ---------------- Avatar (wraps @davinci/ui Avatar) ---------------- */
const VARIANT_BG = {
  g1: "var(--blue-9)", g2: "var(--teal-9)", g3: "var(--grass-9)",
  g4: "var(--violet-9)", g5: "var(--amber-9)", g6: "var(--tomato-9)",
};
export function Avatar({ initials, size = 40, variant = "g1", photo, photoSeed, bg, style, className = "" }) {
  let resolved = null;
  if (photo === null) resolved = null;
  else if (typeof photo === "string") resolved = photo;
  else if (photoSeed) resolved = maybePhoto(photoSeed, size * 2, size * 2);
  const radius = style && style.borderRadius != null ? style.borderRadius : "50%";
  return (
    <UIAvatar
      className={className}
      style={{ width: size, height: size, borderRadius: radius, flexShrink: 0, ...style }}
    >
      {resolved && <AvatarImage src={resolved} alt="" style={{ borderRadius: "inherit" }} />}
      <AvatarFallback
        style={{
          background: bg || VARIANT_BG[variant] || "var(--bg-active)",
          color: "#fff", borderRadius: "inherit",
          fontSize: Math.round(size * 0.38), fontWeight: 600,
        }}
      >
        {initials}
      </AvatarFallback>
    </UIAvatar>
  );
}

/* ---------------- Pill (wraps @davinci/ui Badge) ---------------- */
const PILL_STYLE = {
  accent: { background: "var(--accent-subtle)", color: "var(--accent-fg)", borderColor: "transparent" },
  success: { background: "var(--success)", color: "#fff", borderColor: "transparent" },
  alt: { background: "var(--alt-subtle)", color: "var(--alt-fg)", borderColor: "transparent" },
};
export function Pill({ children, variant, style }) {
  return (
    <Badge variant="secondary" className="rounded-full" style={{ ...(PILL_STYLE[variant] || {}), ...style }}>
      {children}
    </Badge>
  );
}

/* ---------------- Panel (wraps @davinci/ui Card; reuses .panel__* chrome) ---------------- */
export function Panel({ title, action, children, style, bodyStyle, className = "", bare = false }) {
  return (
    <Card className={`gap-0 overflow-hidden py-0 ${className}`.trim()} style={style}>
      {(title || action) && (
        <header className="panel__header">
          {title ? <span>{title}</span> : <span />}
          {action}
        </header>
      )}
      {/* `bare` skips the .panel__body padding for content that carries its
          own (composer, post) — otherwise padding stacks. */}
      {bare ? children : <div className="panel__body" style={bodyStyle}>{children}</div>}
    </Card>
  );
}

/* ---------------- Promoted / sponsored content ---------------- */
function PromotedMeta({ advertiser, subtitle, logoInitials, logoVariant = "g5" }) {
  return (
    <div style={{ display: "flex", gap: 10, alignItems: "center", padding: "12px 16px 0" }}>
      <Avatar initials={logoInitials} size={40} variant={logoVariant} style={{ borderRadius: 8 }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 600, fontFamily: "var(--font-display)" }}>{advertiser}</div>
        <div className="meta" style={{ display: "flex", alignItems: "center", gap: 4 }}>
          {subtitle} <span className="dot-sep" /> <span>Promoted</span>
        </div>
      </div>
      <Button variant="ghost" size="icon-sm" icon="close" />
    </div>
  );
}

export function FeedAd({ ad }) {
  return (
    <Card className="gap-0 overflow-hidden py-0" aria-label="Sponsored content">
      <PromotedMeta advertiser={ad.advertiser} subtitle={ad.followers} logoInitials={ad.logo} logoVariant={ad.logoVariant} />
      <div style={{ padding: "10px 16px 14px", fontSize: 14, lineHeight: 1.55 }}>{ad.hook}</div>
      <div style={{
        height: 220, background: ad.creative || "linear-gradient(135deg, var(--blue-8), var(--blue-10))",
        borderTop: "1px solid var(--border-subtle)", borderBottom: "1px solid var(--border-subtle)",
        position: "relative", overflow: "hidden", display: "flex", alignItems: "flex-end",
      }}>
        {ad.creativeOverlay}
      </div>
      <div style={{ padding: "12px 16px", display: "flex", alignItems: "center", gap: 12, background: "var(--bg-subtle)" }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 600, fontFamily: "var(--font-display)" }}>{ad.title}</div>
          <div className="meta">{ad.domain}</div>
        </div>
        <Button variant="outline" size="sm" pill iconRight="arrow_forward">{ad.cta}</Button>
      </div>
    </Card>
  );
}

export function RailAd({ ad }) {
  return (
    <Card className="gap-0 overflow-hidden py-0" aria-label="Sponsored content">
      <div style={{ height: 96, background: ad.creative || "linear-gradient(135deg, var(--yellow-7), var(--yellow-10))", position: "relative" }}>
        <div style={{
          position: "absolute", top: 8, right: 8, background: "rgba(0,0,0,.4)", color: "#fff",
          fontSize: 10, fontWeight: 600, letterSpacing: "0.04em", padding: "2px 6px", borderRadius: 4, textTransform: "uppercase",
        }}>Promoted</div>
      </div>
      <div style={{ padding: "12px 14px" }}>
        <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
          <Avatar initials={ad.logo} size={32} variant={ad.logoVariant || "g5"} style={{ borderRadius: 6 }} />
          <div style={{ fontSize: 12, fontWeight: 600, fontFamily: "var(--font-display)", minWidth: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{ad.advertiser}</div>
        </div>
        <div style={{ fontSize: 12, lineHeight: 1.45, color: "var(--fg)", marginBottom: 10 }}>{ad.hook}</div>
        <Button variant="outline" size="sm" pill style={{ width: "100%" }}>{ad.cta}</Button>
      </div>
    </Card>
  );
}

export function InlineAd({ ad }) {
  return (
    <div role="complementary" aria-label="Sponsored" style={{
      display: "flex", alignItems: "center", gap: 12, padding: "12px 16px",
      background: "var(--bg-subtle)", border: "1px solid var(--border-subtle)", borderRadius: 10,
    }}>
      <Avatar initials={ad.logo} size={40} variant={ad.logoVariant || "g5"} style={{ borderRadius: 6 }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 13, fontWeight: 600, fontFamily: "var(--font-display)" }}>{ad.advertiser}</span>
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", color: "var(--fg-muted)", textTransform: "uppercase", padding: "1px 6px", border: "1px solid var(--border-subtle)", borderRadius: 4 }}>Promoted</span>
        </div>
        <div style={{ fontSize: 12, color: "var(--fg-muted)", marginTop: 2, lineHeight: 1.4 }}>{ad.hook}</div>
      </div>
      <Button variant="outline" size="sm" pill>{ad.cta}</Button>
    </div>
  );
}

export const AD_LIBRARY = {
  notion: {
    advertiser: "Atlas Docs", followers: "214,882 followers", logo: "A", logoVariant: "g5",
    hook: "Your team's knowledge, but it actually stays up to date. Atlas AI rewrites stale docs in place, flags conflicts, and learns your team's voice.",
    title: "Start a 30-day pilot for your team", domain: "atlasdocs.com · Sponsored",
    creative: "linear-gradient(135deg, #1f2937 0%, #111827 100%)", cta: "Learn more",
    creativeOverlay: (
      <div style={{ padding: 24, width: "100%", display: "grid", gridTemplateColumns: "auto 1fr", gap: 16, alignItems: "center" }}>
        <div style={{ width: 72, height: 72, borderRadius: 12, background: "linear-gradient(135deg, var(--blue-7), var(--blue-9))", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 36 }}>A</div>
        <div style={{ color: "#fff" }}>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 22, letterSpacing: "-0.02em" }}>Docs that write themselves</div>
          <div style={{ fontSize: 13, opacity: 0.7, marginTop: 4 }}>Free for teams under 10 · No credit card</div>
        </div>
      </div>
    ),
  },
  figma: {
    advertiser: "Frame Design Tools", followers: "1.2M followers", logo: "F", logoVariant: "g4",
    hook: "Frame 2026 is here. Real-time cursors, vector networks, and AI-assisted specs — all in one collaborative canvas.",
    title: "Try Frame 2026 free", domain: "frame.design · Sponsored", cta: "Get started",
    creative: "linear-gradient(135deg, #a23289 0%, #d14b92 100%)",
    creativeOverlay: (
      <div style={{ padding: 24, width: "100%", color: "#fff" }}>
        <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 26, letterSpacing: "-0.02em", lineHeight: 1.1 }}>Design, prototype,<br /> and spec — together.</div>
        <div style={{ marginTop: 10, opacity: 0.85, fontSize: 13 }}>Free for up to 5 editors.</div>
      </div>
    ),
  },
  aws: {
    advertiser: "Skyline Cloud", logo: "S", logoVariant: "g5",
    hook: "Ship to every region without a DevOps team. $300 credit for new orgs.", cta: "Claim credit",
    creative: "linear-gradient(135deg, #246b64, #3ea889)",
  },
  course: {
    advertiser: "Craft School", logo: "CS", logoVariant: "g4",
    hook: "6-week cohort on design systems. Led by staff designers from Helix & Pylon.", cta: "Apply",
    creative: "linear-gradient(135deg, #7c4a1f, #c0864f)",
  },
  recruit: {
    advertiser: "Helix Systems", logo: "HX", logoVariant: "g2",
    hook: "Hiring design engineers across EU timezones. Remote-first, 4-day week.", cta: "View roles",
    creative: "linear-gradient(135deg, var(--blue-7), var(--blue-9))",
  },
};
