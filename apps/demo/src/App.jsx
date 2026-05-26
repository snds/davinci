import * as React from "react";

import { Surface } from "@davinci/ui/components/ui/surface";
import { Input } from "@davinci/ui/components/ui/input";
import { Textarea } from "@davinci/ui/components/ui/textarea";
import { RichTextarea } from "@davinci/ui/components/ui/rich-textarea";
import { Separator } from "@davinci/ui/components/ui/separator";
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from "@davinci/ui/components/ui/select";

import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuLabel,
} from "@davinci/ui/components/ui/dropdown-menu";
import {
  Popover, PopoverTrigger, PopoverContent, PopoverAnchor,
} from "@davinci/ui/components/ui/popover";

import {
  Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription, DialogClose,
} from "@davinci/ui/components/ui/dialog";
import {
  Sheet, SheetTrigger, SheetContent, SheetHeader, SheetFooter, SheetTitle, SheetDescription, SheetClose,
} from "@davinci/ui/components/ui/sheet";
import {
  Tabs, TabsList, TabsTrigger, TabsContent,
} from "@davinci/ui/components/ui/tabs";
import { Switch } from "@davinci/ui/components/ui/switch";
import { Progress } from "@davinci/ui/components/ui/progress";
import { Label } from "@davinci/ui/components/ui/label";

import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";

import {
  Icon, seededPhoto, Button, Avatar, Pill, Panel,
  FeedAd, RailAd, InlineAd, AD_LIBRARY,
  Tip, HoverProfile, TooltipProvider, StatusBadge, brandLogo,
} from "./lib.jsx";
import { COMPANIES, GENERIC, companyIdFor, COMPANY_LOCATIONS } from "./companies.js";

const WORLD_GEO = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

function LocationsMap({ locations = [] }) {
  const [hover, setHover] = React.useState(null);
  return (
    <div className="locations-map-wrap">
      <ComposableMap projectionConfig={{ scale: 135 }} width={800} height={360} style={{ width: "100%", height: "auto" }}>
        <Geographies geography={WORLD_GEO}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill="var(--bg-active)"
                stroke="var(--border-strong)"
                strokeWidth={0.4}
                style={{ default: { outline: "none" }, hover: { fill: "var(--bg-active)", outline: "none" }, pressed: { outline: "none" } }}
              />
            ))
          }
        </Geographies>
        {locations.map((loc, i) => (
          <Marker key={i} coordinates={loc.coords} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}>
            <circle r={hover === i ? 7 : 5} fill="var(--accent)" stroke="#fff" strokeWidth={1.5} style={{ cursor: "pointer", transition: "r 120ms" }} />
            {hover === i && (
              <g transform="translate(0,-12)" style={{ pointerEvents: "none" }}>
                <rect x={-62} y={-30} width={124} height={28} rx={5} fill="var(--bg-elevated)" stroke="var(--border-subtle)" strokeWidth={0.5} />
                <text textAnchor="middle" y={-17} fontSize={9} fontWeight="700" fill="var(--fg)">{loc.name}</text>
                <text textAnchor="middle" y={-7} fontSize={8} fill="var(--fg-muted)">{loc.label}</text>
              </g>
            )}
          </Marker>
        ))}
      </ComposableMap>
    </div>
  );
}

const { useState, useEffect, useRef } = React;

// App-wide navigation helpers (avoids prop-drilling everywhere).
const NavContext = React.createContext({ goToCompany: () => {}, openFooter: () => {}, goToProfile: () => {}, goToJobs: () => {} });

/* ============================ Form / setting helpers ============================ */
// Labelled field — pairs the DS Label with any control (Input, Select, Textarea).
function Field({ label, children }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <Label className="text-xs text-[var(--fg-muted)]">{label}</Label>
      {children}
    </div>
  );
}
// Setting row — label + description on the left, a DS Switch on the right.
function SettingRow({ label, desc, defaultChecked, checked, onCheckedChange }) {
  return (
    <label style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 500 }}>{label}</div>
        {desc && <div style={{ fontSize: 12, color: "var(--fg-muted)", marginTop: 1 }}>{desc}</div>}
      </div>
      <Switch defaultChecked={defaultChecked} checked={checked} onCheckedChange={onCheckedChange} />
    </label>
  );
}

/* ============================ Reactions + comments ============================ */
/* Standard social reaction set, rendered with Material Symbols. Each type has a
   consistent color wherever it appears. State is persisted to localStorage so the
   demo feels like a living product (no backend). */
const REACTIONS = [
  { id: "like", label: "Like", icon: "thumb_up", color: "var(--blue-9)" },
  { id: "love", label: "Love", icon: "favorite", color: "var(--red-9)" },
  { id: "celebrate", label: "Celebrate", icon: "celebration", color: "var(--green-9)" },
  { id: "support", label: "Support", icon: "volunteer_activism", color: "var(--violet-9)" },
  { id: "insightful", label: "Insightful", icon: "lightbulb", color: "var(--amber-9)" },
  { id: "funny", label: "Funny", icon: "mood", color: "var(--teal-9)" },
];
const REACTION_BY_ID = Object.fromEntries(REACTIONS.map((r) => [r.id, r]));

function loadStore(key) { try { return JSON.parse(localStorage.getItem(key) || "{}"); } catch { return {}; } }
function saveStore(key, val) { try { localStorage.setItem(key, JSON.stringify(val)); } catch { /* ignore */ } }

function useReaction(postId) {
  const [reaction, set] = useState(() => loadStore("davinci_reactions")[postId] || null);
  const update = (id) => {
    set(id);
    const store = loadStore("davinci_reactions");
    if (id) store[postId] = id; else delete store[postId];
    saveStore("davinci_reactions", store);
  };
  return [reaction, update];
}

function useComments(postId, seed = []) {
  const [list, setList] = useState(() => loadStore("davinci_comments")[postId] || seed);
  const add = (text) => {
    const next = [...list, { author: "Yara Okonkwo", text, time: "Just now", me: true }];
    setList(next);
    const store = loadStore("davinci_comments");
    store[postId] = next;
    saveStore("davinci_comments", store);
  };
  return [list, add];
}

function ReactionChips({ ids }) {
  return (
    <span className="reaction-chips">
      {ids.map((id) => {
        const r = REACTION_BY_ID[id];
        return r ? <span key={id} className="reaction-chip" style={{ background: r.color }}><Icon name={r.icon} filled /></span> : null;
      })}
    </span>
  );
}

function ReactionBar({ postId, baseReactions, topReactions = ["like", "love", "insightful"], commentCount, onToggleComments }) {
  const [reaction, setReaction] = useReaction(postId);
  const [flyout, setFlyout] = useState(false);
  const holdRef = useRef(null);
  const heldRef = useRef(false);

  const startHold = () => { heldRef.current = false; holdRef.current = setTimeout(() => { heldRef.current = true; setFlyout(true); }, 350); };
  const endHold = () => clearTimeout(holdRef.current);
  const onClick = () => { if (heldRef.current) return; setReaction(reaction ? null : "like"); };
  const pick = (id) => { setReaction(id === reaction ? null : id); setFlyout(false); };

  const current = reaction ? REACTION_BY_ID[reaction] : null;
  const total = baseReactions + (reaction ? 1 : 0);
  const chips = (reaction ? [reaction, ...topReactions.filter((r) => r !== reaction)] : topReactions).slice(0, 3);

  return (
    <>
      <div className="post__reactions">
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
          <ReactionChips ids={chips} /> {total.toLocaleString()}
        </span>
        <button type="button" onClick={onToggleComments} style={{ color: "inherit", cursor: "pointer" }}>{commentCount} comments</button>
      </div>
      <div className="post__actions">
        <div style={{ position: "relative", flex: 1, display: "flex" }} onMouseLeave={() => setFlyout(false)}>
          {flyout && (
            <div className="reaction-flyout" role="menu" aria-label="Pick a reaction">
              {REACTIONS.map((r) => (
                <button key={r.id} type="button" className="reaction-flyout__btn" title={r.label} aria-label={r.label} onClick={() => pick(r.id)} style={{ color: r.color }}>
                  <Icon name={r.icon} filled />
                </button>
              ))}
            </div>
          )}
          <button type="button" className={`post__action ${current ? "active" : ""}`} style={current ? { color: current.color } : undefined}
            onPointerDown={startHold} onPointerUp={endHold} onPointerLeave={endHold} onClick={onClick} aria-label="Like (press and hold for reactions)">
            <Icon name={current ? current.icon : "thumb_up"} filled={!!current} /><span>{current ? current.label : "Like"}</span>
          </button>
        </div>
        <button type="button" className="post__action" onClick={onToggleComments}><Icon name="chat_bubble" /><span>Comment</span></button>
        <button type="button" className="post__action"><Icon name="repeat" /><span>Repost</span></button>
        <button type="button" className="post__action"><Icon name="send" /><span>Send</span></button>
      </div>
    </>
  );
}

function Comments({ postId, seed }) {
  const [list, add] = useComments(postId, seed);
  const [draft, setDraft] = useState("");
  const submit = () => { const t = draft.trim(); if (!t) return; add(t); setDraft(""); };
  return (
    <div className="post__comments">
      <div className="comment-composer">
        <Avatar initials="YO" size={32} photo={seededPhoto("yara-okonkwo", 64, 64, "face")} />
        <Input size="sm" className="!rounded-full" placeholder="Add a comment…" value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") submit(); }} />
        <Button variant="primary" size="sm" pill onClick={submit} disabled={!draft.trim()}>Post</Button>
      </div>
      {list.map((c, i) => (
        <div key={i} className="comment">
          <Avatar initials={c.me ? "YO" : (c.author || "?").slice(0, 2).toUpperCase()} size={32} variant="g3" photoSeed={c.me ? null : c.author} photo={c.me ? seededPhoto("yara-okonkwo", 64, 64, "face") : undefined} />
          <div className="comment__bubble">
            <div className="comment__author">{c.author}</div>
            <div className="comment__text">{c.text}</div>
            <div className="comment__time">{c.time}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ============================ Footers ============================ */
/* Single-color, resizable Davinci mark (currentColor): a rounded square with
   a knocked-out "D" counter + accent dot. Inherits color + scales to any size. */
function LogoMark({ size = 14, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" className={className} role="img" aria-label="Davinci" style={{ display: "inline-block", verticalAlign: "-2px", flexShrink: 0 }}>
      <path
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8 0 H32 A8 8 0 0 1 40 8 V32 A8 8 0 0 1 32 40 H8 A8 8 0 0 1 0 32 V8 A8 8 0 0 1 8 0 Z M11 10 h10 a10 10 0 0 1 10 10 a10 10 0 0 1 -10 10 h-10 z"
      />
      <circle cx="24" cy="20" r="3" fill="currentColor" />
    </svg>
  );
}

function RailFooter() {
  const { openFooter } = React.useContext(NavContext);
  const links = ["About", "Accessibility", "Help Center", "Privacy & Terms", "Ad Choices", "Advertising", "Business Services", "Get the app"];
  return (
    <div className="rail-footer">
      <div className="rail-footer__links">
        {links.map((l) => <button key={l} onClick={openFooter}>{l}</button>)}
        <button onClick={openFooter}>More</button>
      </div>
      <div className="rail-footer__copy"><LogoMark size={14} /> Davinci Corporation © 2026</div>
    </div>
  );
}

function SiteFooter({ onClose }) {
  const cols = [
    ["General", ["About", "Accessibility", "Help Center", "Privacy & Terms", "Ad Choices"]],
    ["Solutions", ["Talent Solutions", "Marketing Solutions", "Advertising", "Sales Solutions"]],
    ["Directories", ["Members", "Jobs", "Companies", "Learning", "Mobile"]],
  ];
  return (
    <div className="site-footer" role="dialog" aria-label="Site footer">
      <div className="site-footer__inner">
        <Button variant="ghost" size="icon" className="site-footer__close" aria-label="Close footer" onClick={onClose}><Icon name="close" /></Button>
        <div className="site-footer__cols">
          {cols.map(([h, items]) => (<div key={h}><div className="site-footer__h">{h}</div>{items.map((i) => <a key={i}>{i}</a>)}</div>))}
          <div className="site-footer__meta">
            <div><strong>Questions?</strong><div className="meta">Visit our Help Center.</div></div>
            <div><strong>Manage your account and privacy</strong><div className="meta">Go to your Settings.</div></div>
            <div><strong>Recommendation transparency</strong><div className="meta">Learn more about Recommended Content.</div></div>
          </div>
          <div>
            <div className="site-footer__h">Select language</div>
            <Select defaultValue="en">
              <SelectTrigger size="sm" className="w-full"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English (English)</SelectItem>
                <SelectItem value="es">Español (Spanish)</SelectItem>
                <SelectItem value="fr">Français (French)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="site-footer__copy"><LogoMark size={16} /> Davinci Corporation © 2026</div>
      </div>
    </div>
  );
}

/* ============================ Logo ============================ */
function Logo() {
  return (
    <svg viewBox="0 0 220 56" width={Math.round(32 * (220 / 56))} height={32} role="img" aria-label="Davinci">
      <g transform="translate(4,8)">
        <rect x="0" y="0" width="40" height="40" rx="8" style={{ fill: "var(--dv-logo-mark)" }} />
        <path d="M11 10 h10 a10 10 0 0 1 10 10 v0 a10 10 0 0 1 -10 10 h-10 z" style={{ fill: "var(--dv-logo-counter)" }} />
        <circle cx="24" cy="20" r="3" style={{ fill: "var(--dv-logo-accent)" }} />
      </g>
      <text x="54" y="29.5" dominantBaseline="central" style={{ fill: "var(--dv-logo-text)", fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 30, letterSpacing: "-0.02em" }}>davinci</text>
    </svg>
  );
}

/* ============================ Search ============================ */
/* The result pool. This is dummy content: search is intentionally NOT a live
   index query. Only the curated SAVED_SEARCHES below return results — each
   names the entries it surfaces by id (see savedSearchFor). Typing anything
   that isn't a saved search yields an empty, "try one of these" state. */
const SEARCH_INDEX = [
  // People
  { type: "person", id: "p1", title: "Sofia Antonova", sub: "Staff Designer · Helix", avatar: "SA", variant: "g4", connection: "2nd", location: "Lisbon, PT", industry: "Design" },
  { type: "person", id: "p3", title: "Sonya Petersen", sub: "Product Manager · Atlas", avatar: "SP", variant: "g2", connection: "2nd", location: "Oslo, NO", industry: "Product" },
  { type: "person", id: "p4", title: "Solomon Reyes", sub: "Design Engineer · Vector", avatar: "SR", variant: "g6", connection: "1st", location: "Mexico City, MX", industry: "Engineering" },
  { type: "person", id: "p5", title: "Miriam Chen", sub: "VP Design · Helix", avatar: "MC", variant: "g4", connection: "2nd", location: "London, UK", industry: "Design" },
  { type: "person", id: "p6", title: "Daniel Amrani", sub: "Head of Brand · Pylon", avatar: "DA", variant: "g2", connection: "1st", location: "Tel Aviv, IL", industry: "Design" },
  { type: "person", id: "p7", title: "Priya Ravi", sub: "Design Engineer · Atlas", avatar: "PR", variant: "g5", connection: "3rd", location: "Bengaluru, IN", industry: "Engineering" },
  // Companies
  { type: "company", id: "c1", title: "Helix Systems", sub: "Product & Design Platform · 24,802 followers", avatar: "HX", variant: "g2", industry: "Software", location: "Lisbon, PT" },
  { type: "company", id: "c2", title: "Atlas Docs", sub: "Knowledge Tools · 214,882 followers", avatar: "AT", variant: "g5", industry: "Software", location: "New York, NY" },
  { type: "company", id: "c4", title: "Vector Project OS", sub: "Developer Tools · 42,112 followers", avatar: "VE", variant: "g6", industry: "Software", location: "Amsterdam, NL" },
  // Jobs
  { type: "job", id: "j1", title: "Staff Product Designer", sub: "Helix · Lisbon or Remote · 5d", avatar: "HX", variant: "g2", industry: "Design", location: "Lisbon, PT" },
  { type: "job", id: "j2", title: "Senior Design Engineer", sub: "Atlas Docs · Remote · 2d", avatar: "AT", variant: "g5", industry: "Engineering", location: "Remote" },
  { type: "job", id: "j3", title: "Design Systems Lead", sub: "Vector · Amsterdam · 1w", avatar: "VE", variant: "g6", industry: "Design", location: "Amsterdam, NL" },
  // Groups
  { type: "group", id: "g1", title: "Design Systems Guild", sub: "28,402 members · Active daily", avatar: "DS", variant: "g4", industry: "Design" },
  { type: "group", id: "g2", title: "Design Engineers", sub: "12,104 members · 4 new posts today", avatar: "DE", variant: "g5", industry: "Engineering" },
  // Posts
  { type: "post", id: "post1", title: '"Most design systems are asset libraries with a sitemap…"', sub: "Daniel Amrani · 1,204 reactions", avatar: "DA", variant: "g2", industry: "Design" },
  { type: "post", id: "post2", title: "Shipping a refresh of our component library today.", sub: "Sofia Antonova · 482 reactions", avatar: "SA", variant: "g4", industry: "Design" },
  // Courses
  { type: "course", id: "co1", title: "UX Design Foundations", sub: "Diane Cronenwett · 4h 12m · 128K learners", avatar: "UX", variant: "g4", industry: "Design" },
  { type: "course", id: "co2", title: "Design Systems with Tokens", sub: "Anne Grundhoefer · 2h 30m · 54K learners", avatar: "DS", variant: "g2", industry: "Design" },
  { type: "course", id: "co3", title: "Prototyping Microinteractions", sub: "Tom Green · 3h 33m · 21K learners", avatar: "PM", variant: "g5", industry: "Design" },
  // Events
  { type: "event", id: "ev1", title: "Design Confessional: May UX Meetup", sub: "Thu, May 28 · Cardiff-by-the-Sea · 8 attendees", avatar: "DC", variant: "g6", industry: "Design", location: "Cardiff, UK" },
  { type: "event", id: "ev2", title: "Design Systems Coffee & Critique", sub: "Tue, Jun 3 · Remote · 142 attendees", avatar: "CC", variant: "g4", industry: "Design", location: "Remote" },
  // Products
  { type: "product", id: "pd1", title: "Vector UI Kit", sub: "Web Design Software · by Intuition SofTech", avatar: "VK", variant: "g4", industry: "Software" },
  { type: "product", id: "pd2", title: "Prototype Studio", sub: "Design Software · by WebMedia", avatar: "PS", variant: "g2", industry: "Software" },
  { type: "product", id: "pd3", title: "Token Manager", sub: "Design Ops · by PerfectionGeeks", avatar: "TM", variant: "g5", industry: "Software" },
  // Schools
  { type: "school", id: "sc1", title: "UX Design Institute", sub: "Dublin · 5,664 students & alumni", avatar: "UXD", variant: "g4", industry: "Education", location: "Dublin, IE" },
  { type: "school", id: "sc2", title: "UX Design Academy", sub: "Kaunas · 8 students & alumni", avatar: "UXA", variant: "g2", industry: "Education", location: "Kaunas, LT" },
  { type: "school", id: "sc3", title: "Davinci Design School", sub: "Remote · 2,194 students & alumni", avatar: "DD", variant: "g6", industry: "Education", location: "Remote" },
  // Services
  { type: "service", id: "sv1", title: "UX & UI Design Services", sub: "Jennifer Lau · UX/UI Designer", avatar: "JL", variant: "g4", industry: "Design", location: "United States" },
  { type: "service", id: "sv2", title: "Design Systems Consulting", sub: "Scott Jenson · UX Strategy", avatar: "SJ", variant: "g2", industry: "Design", location: "Palo Alto, CA" },
  { type: "service", id: "sv3", title: "Product Design Studio", sub: "Neil Duan · Head of Design", avatar: "ND", variant: "g6", industry: "Design", location: "San Francisco, CA" },
];
const INDEX_BY_ID = Object.fromEntries(SEARCH_INDEX.map((e) => [e.id, e]));

const TYPE_LABELS = { person: "Person", company: "Company", job: "Job", group: "Group", post: "Post", course: "Course", event: "Event", product: "Product", school: "School", service: "Service" };
const TYPE_ICONS = { person: "person", company: "work", job: "work", group: "groups", post: "article", course: "play_circle", event: "event", product: "category", school: "school", service: "handshake" };

/* Result categories (LinkedIn-style). `types` maps a category to the index
   entry types it surfaces; `all` surfaces everything. Each category bubbles up
   its own filter chips (see SearchResults) so the side panel is optional. */
const SEARCH_CATEGORIES = [
  { id: "all", label: "All", icon: "manage_search" },
  { id: "people", label: "People", icon: "person", types: ["person"] },
  { id: "jobs", label: "Jobs", icon: "work", types: ["job"] },
  { id: "companies", label: "Companies", icon: "apartment", types: ["company"] },
  { id: "groups", label: "Groups", icon: "groups", types: ["group"] },
  { id: "posts", label: "Posts", icon: "article", types: ["post"] },
  { id: "courses", label: "Courses", icon: "play_circle", types: ["course"] },
  { id: "events", label: "Events", icon: "event", types: ["event"] },
  { id: "products", label: "Products", icon: "category", types: ["product"] },
  { id: "schools", label: "Schools", icon: "school", types: ["school"] },
  { id: "services", label: "Services", icon: "handshake", types: ["service"] },
];
const CAT_BY_TYPE = { person: "people", company: "companies", job: "jobs", group: "groups", post: "posts", course: "courses", event: "events", product: "products", school: "schools", service: "services" };

/* Curated saved searches — the ONLY queries that return results. `label` is
   both the display string and the exact query the user must type/choose;
   `resultIds` are the entries it surfaces. One per category (People has two)
   plus a mixed "design" search that lights up the All view across types. */
const SAVED_SEARCHES = [
  { label: "design", category: "all", resultIds: ["p4", "c1", "j1", "g1", "co1", "post1", "sv1"] },
  { label: "design engineer", category: "people", resultIds: ["p4", "p7"] },
  { label: "priya ravi", category: "people", resultIds: ["p7"] },
  { label: "product designer", category: "jobs", resultIds: ["j1", "j2", "j3"] },
  { label: "helix systems", category: "companies", resultIds: ["c1", "c2", "c4"] },
  { label: "design systems", category: "groups", resultIds: ["g1", "g2"] },
  { label: "design leadership", category: "posts", resultIds: ["post1", "post2"] },
  { label: "ux design course", category: "courses", resultIds: ["co1", "co2", "co3"] },
  { label: "ux meetup", category: "events", resultIds: ["ev1", "ev2"] },
  { label: "design tools", category: "products", resultIds: ["pd1", "pd2", "pd3"] },
  { label: "ux design institute", category: "schools", resultIds: ["sc1", "sc2", "sc3"] },
  { label: "design services", category: "services", resultIds: ["sv1", "sv2", "sv3"] },
];
const norm = (q) => (q || "").trim().toLowerCase();
// The matching saved search for a query string (exact, case-insensitive), or null.
function savedSearchFor(q) {
  const n = norm(q);
  return SAVED_SEARCHES.find((s) => norm(s.label) === n) || null;
}
// Saved searches whose label contains the typed text — drives the typeahead.
function suggestSaved(q) {
  const n = norm(q);
  return n ? SAVED_SEARCHES.filter((s) => s.label.toLowerCase().includes(n)) : SAVED_SEARCHES;
}
// The resolved result entries for a (valid) query, else [].
function resultsFor(q) {
  const s = savedSearchFor(q);
  return s ? s.resultIds.map((id) => INDEX_BY_ID[id]).filter(Boolean) : [];
}
function highlightMatch(text, query) {
  if (!query) return text;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx < 0) return text;
  return (<>{text.slice(0, idx)}<mark style={{ background: "var(--accent-subtle)", color: "var(--accent-fg)", padding: "0 2px", borderRadius: 2 }}>{text.slice(idx, idx + query.length)}</mark>{text.slice(idx + query.length)}</>);
}

function SearchBox({ value, onChange, onSubmit }) {
  const [open, setOpen] = useState(false);
  const submit = (q, category) => { onSubmit?.(q, category); setOpen(false); };
  // Combobox pattern: the input is the Popover anchor, not its trigger, so it
  // keeps focus while the typeahead is open. Radix owns outside-click / Escape
  // dismissal (no document listener); we suppress content auto-focus so typing
  // is never interrupted.
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverAnchor asChild>
        <div className="relative w-full max-w-72">
          <Icon name="search" className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-[18px] text-[var(--fg-subtle)]" />
          <Input size="sm" className="ps-9" placeholder="Search" value={value} aria-label="Search"
            onChange={(e) => { onChange(e.target.value); setOpen(true); }}
            onFocus={() => setOpen(true)}
            onKeyDown={(e) => { if (e.key === "Enter") submit(value); else if (e.key === "Escape") setOpen(false); }}
          />
        </div>
      </PopoverAnchor>
      <PopoverContent
        align="start"
        sideOffset={6}
        onOpenAutoFocus={(e) => e.preventDefault()}
        onCloseAutoFocus={(e) => e.preventDefault()}
        className="max-h-[520px] w-[420px] overflow-y-auto rounded-[10px] p-0 py-1.5"
      >
        <Typeahead query={value} onSubmit={submit} />
      </PopoverContent>
    </Popover>
  );
}

/* Typeahead is a saved-search autocomplete. Search is curated, not a live
   index query, so the suggestions ARE the searches that work — choosing one
   (or typing its label verbatim and pressing Enter) runs it. No fuzzy entity
   previews: anything off the list lands on an empty "try one of these" state. */
function Typeahead({ query, onSubmit }) {
  const suggestions = suggestSaved(query);
  const exact = savedSearchFor(query);
  // No .typeahead wrapper here — PopoverContent supplies the positioned frame.
  return (
    <>
      {query && !exact && (
        <div className="typeahead__row typeahead__row--primary" onMouseDown={(e) => { e.preventDefault(); onSubmit(query); }}>
          <span className="typeahead__icon"><Icon name="search" className="text-[18px]" /></span>
          <div style={{ flex: 1, fontSize: 13 }}>Search for <strong>"{query}"</strong></div>
          <Icon name="arrow_forward" className="text-[14px] text-[var(--fg-subtle)]" />
        </div>
      )}
      <div className="typeahead__section-title">{query ? "Suggested searches" : "Recent"}</div>
      {suggestions.length === 0 ? (
        <div style={{ padding: "10px 14px 14px", color: "var(--fg-muted)", fontSize: 13 }}>
          No saved searches match. Try <strong style={{ color: "var(--fg)" }}>{SAVED_SEARCHES[0].label}</strong> or <strong style={{ color: "var(--fg)" }}>{SAVED_SEARCHES[4].label}</strong>.
        </div>
      ) : suggestions.map((s) => (
        <div key={s.label} className="typeahead__row" onMouseDown={(e) => { e.preventDefault(); onSubmit(s.label, s.category); }}>
          <span className="typeahead__icon"><Icon name={query ? "search" : "history"} className="text-[18px]" /></span>
          <div style={{ flex: 1, fontSize: 13 }}>{highlightMatch(s.label, query)}</div>
          <span className="meta" style={{ display: "inline-flex", alignItems: "center", gap: 3 }}>
            <Icon name={SEARCH_CATEGORIES.find((c) => c.id === s.category)?.icon} className="text-[14px]" />
            {SEARCH_CATEGORIES.find((c) => c.id === s.category)?.label}
          </span>
        </div>
      ))}
    </>
  );
}

/* ============================ TopNav ============================ */
function TopNav({ active, onNavigate, searchValue, onSearchChange, onSearchSubmit, alertCount, alertsOpen, onToggleAlerts }) {
  const tabs = [
    { id: "home", label: "Home", icon: "home" },
    { id: "network", label: "Network", icon: "group" },
    { id: "jobs", label: "Jobs", icon: "work" },
    { id: "messaging", label: "Messages", icon: "chat_bubble" },
    { id: "notifications", label: "Alerts", icon: "notifications" },
  ];
  const { goToProfile } = React.useContext(NavContext);
  const [meOpen, setMeOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-[var(--border-subtle)] bg-[var(--bg-surface)]">
      <div className="mx-auto flex h-14 max-w-[1180px] items-center gap-3 px-4">
        <button type="button" onClick={() => onNavigate?.("home")} aria-label="Davinci home" className="flex shrink-0 items-center rounded outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]">
          <Logo />
        </button>
        <SearchBox value={searchValue} onChange={onSearchChange} onSubmit={onSearchSubmit} />
        <nav className="ml-auto flex items-stretch">
          {tabs.map((t) => {
            const isAlerts = t.id === "notifications";
            const tabButton = (
              <button
                className="flex h-14 w-[68px] flex-col items-center justify-center gap-0.5 text-[11px] text-[var(--fg-muted)] outline-none transition-colors hover:text-[var(--fg)] data-[active=true]:text-[var(--fg)] data-[active=true]:shadow-[inset_0_-2px_0_var(--fg)] data-[state=open]:text-[var(--fg)]"
                data-active={active === t.id || undefined}
                onClick={isAlerts ? undefined : () => onNavigate?.(t.id)}
              >
                <span className="relative inline-flex">
                  <Icon name={t.icon} filled={active === t.id} size="lg" />
                  {isAlerts && alertCount > 0 && (
                    <span className="absolute -right-2 -top-1 flex size-4 items-center justify-center rounded-full border-2 border-[var(--bg-surface)] bg-[var(--danger)] text-[10px] font-bold text-white">{alertCount}</span>
                  )}
                </span>
                {t.label}
              </button>
            );
            if (!isAlerts) return <div key={t.id} className="relative">{tabButton}</div>;
            // Radix Popover owns open state + outside-click/Escape dismissal.
            // Opening Alerts closes the Me menu (and vice-versa via Me's handler),
            // so the two nav surfaces are mutually exclusive without manual wiring.
            return (
              <Popover key={t.id} open={alertsOpen} onOpenChange={(o) => { if (o) setMeOpen(false); onToggleAlerts?.(o); }}>
                <PopoverTrigger asChild>{tabButton}</PopoverTrigger>
                <PopoverContent align="end" className="flex max-h-[560px] w-[420px] flex-col overflow-hidden rounded-[10px] p-0">
                  <AlertsDropdown onClose={() => onToggleAlerts?.(false)} onViewAll={() => { onToggleAlerts?.(false); onNavigate?.("notifications"); }} />
                </PopoverContent>
              </Popover>
            );
          })}
          <Separator orientation="vertical" className="mx-2 my-auto h-8" />
          <DropdownMenu open={meOpen} onOpenChange={(o) => { setMeOpen(o); if (o) onToggleAlerts?.(false); }}>
            <DropdownMenuTrigger asChild>
              <button className="flex h-14 w-[68px] flex-col items-center justify-center gap-0.5 text-[11px] text-[var(--fg-muted)] outline-none hover:text-[var(--fg)]">
                <Avatar initials="YO" size={26} photo={seededPhoto("yara-okonkwo", 64, 64, "face")} />
                <span className="flex items-center gap-0.5">Me <Icon name="expand_more" className="text-[14px]" /></span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              <div className="flex gap-3 p-2">
                <Avatar size={48} photo={seededPhoto("yara-okonkwo", 96, 96, "face")} />
                <div className="min-w-0">
                  <div className="font-semibold">Yara Okonkwo</div>
                  <div className="text-xs text-[var(--fg-muted)]">Principal Designer · Davinci Systems</div>
                </div>
              </div>
              <div className="px-2 pb-2">
                <Button variant="outline" size="sm" pill style={{ width: "100%" }} onClick={() => goToProfile()}>View profile</Button>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Account</DropdownMenuLabel>
              <DropdownMenuItem><Icon name="workspace_premium" className="text-[18px] me-1" /> Premium features</DropdownMenuItem>
              <DropdownMenuItem><Icon name="settings" className="text-[18px] me-1" /> Settings &amp; Privacy</DropdownMenuItem>
              <DropdownMenuItem><Icon name="help" className="text-[18px] me-1" /> Help</DropdownMenuItem>
              <DropdownMenuItem><Icon name="language" className="text-[18px] me-1" /> Language</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Manage</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => goToProfile()}><Icon name="history_edu" className="text-[18px] me-1" /> Posts &amp; Activity</DropdownMenuItem>
              <DropdownMenuItem><Icon name="work" className="text-[18px] me-1" /> Job Posting Account</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem><Icon name="logout" className="text-[18px] me-1" /> Sign out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <button className="flex h-14 w-[72px] flex-col items-center justify-center gap-0.5 border-l border-[var(--border-subtle)] text-[11px] text-[var(--fg-muted)] outline-none hover:text-[var(--fg)] data-[active=true]:text-[var(--fg)]" data-active={active === "ads" || undefined} aria-label="Advertise" onClick={() => onNavigate?.("ads")}>
            <Icon name="campaign" size="lg" />
            Advertise
          </button>
        </nav>
      </div>
    </header>
  );
}

/* ============================ Rails ============================ */
function LeftRail({ onViewProfile }) {
  return (
    <>
      <Panel bare className="cursor-pointer" style={{ cursor: "pointer" }}>
        <div role="button" onClick={onViewProfile}>
          <div className="profile-card__cover" style={{ backgroundImage: `url(${seededPhoto("yara-okonkwo-banner", 600, 180, "banner")})`, backgroundSize: "cover", backgroundPosition: "center" }} />
          <div className="profile-card__body">
            <Avatar initials="YO" size={72} photo={seededPhoto("yara-okonkwo", 144, 144, "face")} style={{ border: "3px solid var(--bg-surface)" }} />
            <div className="profile-card__name">Yara Okonkwo</div>
            <div className="profile-card__role">Principal Designer · Davinci Systems</div>
            <Separator className="my-3" />
            <div className="flex justify-between text-xs"><span className="meta">Profile views</span><span style={{ color: "var(--accent-fg)", fontWeight: 600 }}>248</span></div>
            <div className="mt-1.5 flex justify-between text-xs"><span className="meta">Post impressions</span><span style={{ color: "var(--accent-fg)", fontWeight: 600 }}>3,402</span></div>
          </div>
        </div>
      </Panel>
      <Panel bare>
        <ul className="nav-list">
          <li><Icon name="bookmark" /> Saved items</li>
          <li><Icon name="groups" /> Groups <span className="count">12</span></li>
          <li><Icon name="event" /> Events</li>
          <li><Icon name="newspaper" /> Newsletters</li>
        </ul>
      </Panel>
      <RailAd ad={AD_LIBRARY.aws} />
    </>
  );
}

function RightRail() {
  const { goToProfile } = React.useContext(NavContext);
  const news = [
    { t: "AI tools reshape the design stack", sub: "4h ago · 8,204 readers" },
    { t: "Typography on the web, revisited", sub: "6h ago · 3,102 readers" },
    { t: "Remote-first companies hit new peak", sub: "12h ago · 12k readers" },
  ];
  const people = [
    { n: "Miriam Chen", r: "VP Design · Helix", i: "MC", v: "g4" },
    { n: "Daniel Amrani", r: "Head of Brand · Pylon", i: "DA", v: "g2" },
    { n: "Priya Ravi", r: "Design Engineer · Atlas", i: "PR", v: "g5" },
  ];
  return (
    <>
      <Panel title="Davinci News" action={<Icon name="info" className="text-[16px] text-[var(--fg-subtle)]" />} bodyStyle={{ padding: 0 }}>
        {news.map((n, i) => (
          <div key={i} className="rail-item" style={{ alignItems: "flex-start" }}>
            <div style={{ width: 6, height: 6, borderRadius: 3, background: "var(--fg-muted)", marginTop: 7 }} />
            <div className="rail-item__text"><div className="rail-item__title">{n.t}</div><div className="rail-item__sub">{n.sub}</div></div>
          </div>
        ))}
      </Panel>
      <Panel title="People to follow" bodyStyle={{ padding: 0 }}>
        {people.map((p, i) => (
          <div key={i} className="rail-item" onClick={() => goToProfile({ name: p.n, role: p.r, photoSeed: p.n, variant: p.v })} style={{ cursor: "pointer" }}>
            <Avatar initials={p.i} size={40} variant={p.v} photoSeed={p.n} />
            <div className="rail-item__text"><div className="rail-item__title">{p.n}</div><div className="rail-item__sub">{p.r}</div></div>
            <Button variant="outline" size="sm" pill icon="add" onClick={(e) => e.stopPropagation()}>Follow</Button>
          </div>
        ))}
      </Panel>
      <RailAd ad={AD_LIBRARY.course} />
      <RailFooter />
    </>
  );
}

/* ============================ Feed ============================ */
function Composer() {
  const [open, setOpen] = useState(false);
  const composerActions = [
    { icon: "image", label: "Photo", color: "var(--accent-fg)" },
    { icon: "play_circle", label: "Video", color: "var(--success-fg)" },
    { icon: "event", label: "Event", color: "var(--warning-fg)" },
    { icon: "article", label: "Article", color: "var(--danger-fg)" },
  ];
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Panel bare>
        <div className="composer">
          <Avatar initials="YO" size={48} photo={seededPhoto("yara-okonkwo", 96, 96, "face")} />
          <DialogTrigger asChild>
            <button className="composer__input">Share an update, Yara…</button>
          </DialogTrigger>
        </div>
        <div className="composer__actions">
          {composerActions.map((a, i) => (
            <DialogTrigger asChild key={i}>
              <button className="composer__action" type="button"><Icon name={a.icon} style={{ color: a.color }} /><span>{a.label}</span></button>
            </DialogTrigger>
          ))}
        </div>
      </Panel>
      <DialogContent className="sm:max-w-[560px]">
        <DialogHeader>
          <DialogTitle>Create a post</DialogTitle>
          <DialogDescription className="sr-only">Compose and share an update with your network.</DialogDescription>
        </DialogHeader>
        <div className="flex items-center gap-3">
          <Avatar initials="YO" size={48} photo={seededPhoto("yara-okonkwo", 96, 96, "face")} />
          <div>
            <div className="font-semibold" style={{ fontFamily: "var(--font-display)" }}>Yara Okonkwo</div>
            <Pill variant="accent">Post to anyone</Pill>
          </div>
        </div>
        <RichTextarea placeholder="What do you want to talk about?" />
        <DialogFooter className="!justify-between sm:!justify-between">
          <div style={{ display: "flex", gap: 4, color: "var(--fg-muted)" }}>
            {composerActions.map((a) => (
              <Tip key={a.label} label={a.label}>
                <Button variant="ghost" size="icon-sm" icon={a.icon} aria-label={a.label} />
              </Tip>
            ))}
          </div>
          <Button variant="primary" size="sm" pill onClick={() => setOpen(false)}>Post</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function PostMenu() {
  const [saved, setSaved] = useState(false);
  return (
    <DropdownMenu>
      <Tip label="More">
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon-sm" icon="more_horiz" aria-label="Post actions" />
        </DropdownMenuTrigger>
      </Tip>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setSaved((s) => !s)}>
          <Icon name={saved ? "bookmark" : "bookmark_border"} className="text-[18px] me-1" /> {saved ? "Saved" : "Save post"}
        </DropdownMenuItem>
        <DropdownMenuItem><Icon name="link" className="text-[18px] me-1" /> Copy link to post</DropdownMenuItem>
        <DropdownMenuItem><Icon name="notifications_off" className="text-[18px] me-1" /> Mute this author</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem><Icon name="flag" className="text-[18px] me-1" /> Report post</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function Post({ id, author, role, time, avatar, variant = "g1", photoSeed, isCompany, bg, body, attachment, reactions, comments, topReactions, seedComments }) {
  const [showComments, setShowComments] = useState(false);
  const { goToCompany, goToProfile } = React.useContext(NavContext);
  const cid = isCompany ? companyIdFor(author) : null;
  const goAuthor = cid ? () => goToCompany(cid) : isCompany ? undefined : () => goToProfile({ name: author, role, photoSeed: photoSeed || author, variant });
  const followLabel = isCompany ? "Follow" : "Connect";
  const companyPhoto = isCompany ? brandLogo(author) : undefined;
  return (
    <Panel bare>
      <div className="post">
        <div className="post__header">
          <HoverProfile
            name={author} role={role} square={isCompany}
            initials={avatar} variant={variant} photoSeed={photoSeed} photo={companyPhoto}
            meta={isCompany ? "Company · View page" : "View profile"}
            action={<Button variant="outline" size="sm" pill icon={isCompany ? "add" : "person_add"} onClick={goAuthor}>{followLabel}</Button>}
          >
            <button type="button" onClick={goAuthor} style={{ all: "unset", cursor: goAuthor ? "pointer" : "default" }}>
              <Avatar initials={avatar} size={48} variant={variant} photoSeed={photoSeed} photo={companyPhoto} bg={bg} shape={isCompany ? "rounded" : "circle"} />
            </button>
          </HoverProfile>
          <div className="post__who">
            <HoverProfile
              name={author} role={role} square={isCompany}
              initials={avatar} variant={variant} photoSeed={photoSeed} photo={companyPhoto}
              meta={isCompany ? "Company · View page" : "View profile"}
              action={<Button variant="outline" size="sm" pill icon={isCompany ? "add" : "person_add"} onClick={goAuthor}>{followLabel}</Button>}
            >
              <div className="post__name" onClick={goAuthor} style={goAuthor ? { cursor: "pointer", width: "fit-content" } : undefined}>{author}</div>
            </HoverProfile>
            <div className="post__role">{role}</div>
            <div className="post__time">{time} <span className="dot-sep" /> <Icon name="public" size="sm" /></div>
          </div>
          <PostMenu />
        </div>
        <div className="post__body">{body}</div>
        {attachment && (
          <div className="post__attachment">
            <div className="post__attachment-img" style={attachment.image ? { backgroundImage: `url(${attachment.image})`, backgroundSize: "cover", backgroundPosition: "center" } : attachment.style} />
            <div className="post__attachment-body"><strong>{attachment.title}</strong><span className="meta">{attachment.sub}</span></div>
          </div>
        )}
        <ReactionBar postId={id} baseReactions={reactions} topReactions={topReactions} commentCount={comments} onToggleComments={() => setShowComments((s) => !s)} />
        {showComments && <Comments postId={id} seed={seedComments} />}
      </div>
    </Panel>
  );
}

function Feed() {
  const posts = [
    { id: "feed-sofia", author: "Sofia Antonova", role: "Staff Designer at Helix · 2nd", time: "2h", avatar: "SA", variant: "g4", photoSeed: "Sofia Antonova", body: "Shipping a refresh of our component library today. Fewer tokens, warmer neutrals, and — finally — a proper focus ring on every interactive surface.", attachment: { title: "Radix Colors for design systems that age well", sub: "davinci-systems.com · 8 min read", image: seededPhoto("article-radix-colors", 480, 240, "article") }, reactions: 482, comments: 34, topReactions: ["insightful", "like", "love"], seedComments: [
      { author: "Priya Ravi", text: "The focus-ring-on-every-surface bit is so underrated. Congrats on shipping!", time: "1h" },
      { author: "Daniel Amrani", text: "Warmer neutrals — finally. Sand scales age so much better than pure grays.", time: "45m" },
    ] },
    { id: "feed-helix", author: "Helix Systems", role: "Product & Design Platform · 24,802 followers", time: "5h", avatar: "HX", variant: "g2", isCompany: true, body: "We're hiring a Design Engineer to work on our token pipeline. Based in Lisbon or fully remote.", attachment: { title: "Design Engineer · Helix Platform Team", sub: "Remote / Lisbon · 5 days ago", style: { background: "linear-gradient(135deg, var(--yellow-7), var(--yellow-10))" } }, reactions: 188, comments: 12, topReactions: ["like", "celebrate", "support"] },
    { id: "feed-daniel", author: "Daniel Amrani", role: "Head of Brand at Pylon · 1st", time: "1d", avatar: "DA", variant: "g6", photoSeed: "Daniel Amrani", body: "Hot take: most “design systems” are asset libraries with a sitemap. A real system teaches you how to decide — what to build, what to reuse, what to leave alone.", reactions: 1204, comments: 96, topReactions: ["insightful", "like", "funny"] },
  ];
  return (
    <>
      <Composer />
      {posts.map((p, i) => (
        <React.Fragment key={p.id}>
          <Post {...p} />
          {i === 0 && <FeedAd ad={AD_LIBRARY.notion} />}
          {i === 1 && <FeedAd ad={AD_LIBRARY.figma} />}
        </React.Fragment>
      ))}
    </>
  );
}

/* ============================ Profile ============================ */
function ProfileRail({ handle = "yara-okonkwo" }) {
  const { goToCompany, goToProfile } = React.useContext(NavContext);
  const viewers = [
    { name: "Ann Peng", role: "Design at TikTok", conn: "2nd" },
    { name: "Braden Kowitz", role: "Design Leadership", conn: "2nd" },
    { name: "Kacey Lewis", role: "Defender of the Frontend", conn: "2nd" },
    { name: "Jenny Chang", role: "Design @ Vercel", conn: "2nd" },
    { name: "Dan Hiester", role: "Product Builder", conn: "2nd" },
  ];
  const strength = 85;
  return (
    <>
      <Panel title="Profile strength">
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
          <Pill variant="accent">All-Star</Pill>
          <span style={{ marginLeft: "auto", fontSize: 13, fontWeight: 600 }}>{strength}%</span>
        </div>
        <Progress value={strength} />
        <ul style={{ listStyle: "none", margin: "12px 0 0", padding: 0, display: "flex", flexDirection: "column", gap: 8 }}>
          {[["Add 2 more skills", false], ["Verified work email", true], ["Add a featured project", false]].map(([label, done]) => (
            <li key={label} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: done ? "var(--fg-muted)" : "var(--fg)" }}>
              <Icon name={done ? "check_circle" : "radio_button_unchecked"} filled={done} className="text-[16px]" style={{ color: done ? "var(--success-fg)" : "var(--fg-subtle)" }} />
              <span style={{ textDecoration: done ? "line-through" : "none" }}>{label}</span>
            </li>
          ))}
        </ul>
      </Panel>
      <Panel title="Profile language">
        <div style={{ fontSize: 13 }}>English</div>
        <Separator className="my-3" />
        <div style={{ fontWeight: 600, fontSize: 13 }}>Public profile &amp; URL</div>
        <div className="meta" style={{ marginTop: 2 }}>davinci.design/in/{handle}</div>
      </Panel>
      <Panel title="Who your viewers also viewed" bodyStyle={{ padding: 0 }}>
        {viewers.map((p, i) => (
          <div key={i} className="rail-item" onClick={() => goToProfile({ name: p.name, role: p.role, avatar: p.name.slice(0, 2).toUpperCase() })} style={{ cursor: "pointer" }}>
            <Avatar initials={p.name.slice(0, 2).toUpperCase()} size={40} photoSeed={p.name} />
            <div className="rail-item__text"><div className="rail-item__title">{p.name} <span className="meta">· {p.conn}</span></div><div className="rail-item__sub">{p.role}</div></div>
            <Button variant="outline" size="sm" pill icon="add" onClick={(e) => e.stopPropagation()}>Connect</Button>
          </div>
        ))}
      </Panel>
      <Panel title="You might like — Pages for you" bodyStyle={{ padding: 0 }}>
        {Object.values(COMPANIES).slice(0, 3).map((x) => (
          <div key={x.id} className="rail-item" onClick={() => goToCompany(x.id)} style={{ cursor: "pointer" }}>
            <Avatar initials={x.initials} size={40} shape="rounded" photo={brandLogo(x.name)} bg={x.logoBg} />
            <div className="rail-item__text"><div className="rail-item__title">{x.name}</div><div className="rail-item__sub">{x.industry}</div></div>
            <Button variant="outline" size="sm" pill icon="add" onClick={(e) => e.stopPropagation()}>Follow</Button>
          </div>
        ))}
      </Panel>
      <RailAd ad={AD_LIBRARY.course} />
      <RailFooter />
    </>
  );
}

/* ============================ Profiles ============================ */
const ME_NAME = "Yara Okonkwo";
const PROFILE_CITIES = ["Berlin, Germany", "Amsterdam, Netherlands", "London, UK", "New York, NY", "Toronto, Canada", "Barcelona, Spain", "Lisbon, Portugal"];
const PROFILE_SCHOOLS = ["Royal College of Art", "Carnegie Mellon University", "TU Delft", "Parsons School of Design", "University of the Arts London", "Cal Poly"];
const PREV_ROLES = [
  ["Senior Product Designer", "Novatech"], ["Product Designer", "Brightline"],
  ["UX Designer", "Northwind Labs"], ["Design Lead", "Cobalt"], ["Interaction Designer", "Meridian"],
];
const SKILL_POOL = ["Product Design", "Figma", "Design Systems", "Prototyping", "User Research", "Interaction Design", "Accessibility", "Design Ops", "Typography", "React", "Brand", "Workshops"];
function strHash(s) { let h = 0; const str = String(s || ""); for (let i = 0; i < str.length; i++) h = ((h << 5) - h + str.charCodeAt(i)) | 0; return Math.abs(h); }
function pickFrom(arr, seed, salt = 0) { return arr[(strHash(seed) + salt) % arr.length]; }
function cleanRole(role) { return String(role || "").replace(/·\s*\d(?:st|nd|rd|th)\b/i, "").replace(/\s*·\s*$/, "").trim(); }
function parseRole(role) {
  const r = cleanRole(role) || "Product Designer";
  if (r.includes(" at ")) { const [t, c] = r.split(" at "); return { title: t.trim(), company: c.trim() }; }
  if (r.includes(" · ")) { const p = r.split(" · "); return { title: p[0].trim(), company: (p[1] || "").trim() }; }
  return { title: r, company: "" };
}
function initialsOf(name) { return String(name || "").split(" ").filter(Boolean).slice(0, 2).map((w) => w[0]).join("").toUpperCase(); }

// Reveal-on-scroll flag (shared by company + profile sticky headers).
function useStuck(threshold) {
  const [stuck, setStuck] = useState(false);
  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > threshold);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);
  return stuck;
}

// Sticky profile bar: overlays the top of the hero (zero net layout cost via
// negative margin) and fades in once the hero scrolls past — mirrors the
// company page's sticky header.
function ProfileStickyHeader({ name, initials, photoSeed, variant, stuck, actions }) {
  return (
    <div className="profile-sticky">
      <div className={`profile-subnav ${stuck ? "is-stuck" : ""}`} aria-hidden={!stuck}>
        <Avatar size={32} initials={initials} photoSeed={photoSeed} variant={variant} ring={false} />
        <span className="profile-subnav__name">{name}</span>
        <div className="profile-subnav__actions">{actions}</div>
      </div>
    </div>
  );
}

// Templated profile for anyone who isn't the current user. Deterministic from
// the name so a given person always renders the same plausible details.
function OtherProfile({ person }) {
  const { goToCompany, goToProfile } = React.useContext(NavContext);
  const name = person.name;
  const first = name.split(" ")[0];
  const initials = person.avatar || initialsOf(name);
  const { title, company } = parseRole(person.role);
  const cid = company ? companyIdFor(company) : null;
  const city = pickFrom(PROFILE_CITIES, name);
  const connections = 500 + (strHash(name) % 1900);
  const [prevTitle, prevCo] = pickFrom(PREV_ROLES, name, 7);
  const school = pickFrom(PROFILE_SCHOOLS, name, 3);
  const skills = [0, 1, 2, 3, 4, 5].map((i) => SKILL_POOL[(strHash(name) + i * 5) % SKILL_POOL.length]);
  const uniqueSkills = [...new Set(skills)];
  const stuck = useStuck(300);
  const companyLink = (label, id) => (id ? <span onClick={() => goToCompany(id)} style={{ cursor: "pointer", color: "var(--accent-fg)" }}>{label}</span> : label);
  const Entry = ({ logo, logoBg, title: t, sub, time, desc }) => (
    <div className="entry">
      <div className="entry__logo" style={logoBg ? { background: logoBg, color: "#fff" } : undefined}>{logo}</div>
      <div style={{ flex: 1 }}>
        <div className="entry__title">{t}</div>
        {sub && <div className="entry__sub">{sub}</div>}
        {time && <div className="entry__time">{time}</div>}
        {desc && <div className="entry__desc">{desc}</div>}
      </div>
    </div>
  );
  const main = (
    <>
      <ProfileStickyHeader name={name} initials={initials} photoSeed={name} variant={person.variant} stuck={stuck}
        actions={<><Button variant="primary" size="sm" pill icon="person_add">Connect</Button><Button variant="outline" size="sm" pill icon="chat_bubble">Message</Button><MoreMenu pill /></>} />
      <Panel bare>
        <div className="profile-cover" style={{ backgroundImage: `url(${seededPhoto(name + "-banner", 1200, 360, "banner")})`, backgroundSize: "cover", backgroundPosition: "center" }} />
        <div className="profile-header">
          <Avatar initials={initials} size={128} variant={person.variant} photoSeed={name} />
          <div className="profile-header__name">{name}</div>
          <div className="profile-header__headline">{cleanRole(person.role) || title}</div>
          <div className="profile-header__meta">
            <span><Icon name="location_on" className="text-[14px]" /> {city}{company ? <> · {companyLink(company, cid)}</> : null}</span>
            <span><Icon name="group" className="text-[14px]" /> {connections.toLocaleString()} connections</span>
          </div>
          <div className="profile-header__actions">
            <Button variant="primary" icon="person_add">Connect</Button>
            <Button variant="outline" icon="chat_bubble">Message</Button>
            <MoreMenu size="icon" />
          </div>
        </div>
      </Panel>

      <Panel title="About">
        <p style={{ fontSize: 14, lineHeight: 1.6, color: "var(--fg-muted)", margin: 0 }}>
          {first} is a {title.toLowerCase()}{company ? <> at {company}</> : null} who cares about craft, clear systems, and shipping work that holds up. {first} partners closely with engineering and product to turn ambiguous problems into well-defined, well-built experiences.
        </p>
        <div className="entry__skills" style={{ marginTop: 14 }}>
          {uniqueSkills.slice(0, 3).map((s) => <Pill key={s} variant="accent">{s}</Pill>)}
          {uniqueSkills.slice(3).map((s) => <Pill key={s}>{s}</Pill>)}
        </div>
      </Panel>

      <Panel title="Activity" action={<Button variant="outline" size="sm" pill icon="add">Follow</Button>}>
        <div className="meta" style={{ marginBottom: 12 }}>{(2000 + strHash(name) % 8000).toLocaleString()} followers</div>
        <div className="flex flex-col gap-3">
          <Post id={`other-${strHash(name)}`} author={name} role={cleanRole(person.role)} avatar={initials} variant={person.variant} photoSeed={name}
            body={`Some of the most valuable work I do never ships as a feature — it's the shared language, the patterns, and the small decisions that make everything after easier. Grateful to be doing it alongside this team${company ? ` at ${company}` : ""}.`}
            reactions={120 + strHash(name) % 400} comments={4 + strHash(name) % 30} topReactions={["like", "insightful", "celebrate"]} />
        </div>
      </Panel>

      <Panel title="Experience">
        <Entry logo={cid ? COMPANIES[cid].initials : initialsOf(company || title)} logoBg={cid ? COMPANIES[cid].logoBg : "var(--bg-active)"} title={title} sub={companyLink(company || "Independent", cid)} time={`${2021 + strHash(name) % 3} – Present`} desc={`Leads ${title.toLowerCase()} work${company ? ` at ${company}` : ""}, partnering across product and engineering.`} />
        <Entry logo={initialsOf(prevCo)} title={prevTitle} sub={prevCo} time={`${2016 + strHash(name) % 3} – ${2021 + strHash(name) % 3}`} desc="Shipped end-to-end product work across web and mobile." />
      </Panel>

      <Panel title="Education">
        <Entry logo={initialsOf(school)} title={school} sub="BA / MA, Design" time={`${2012 + strHash(name) % 3} – ${2016 + strHash(name) % 3}`} />
      </Panel>

      <Panel title="Skills">
        <div className="entry__skills">{uniqueSkills.map((s) => <Pill key={s} variant="accent">{s}</Pill>)}</div>
      </Panel>
    </>
  );
  return <PageTwoColRight right={<ProfileRail handle={name.toLowerCase().replace(/[^a-z]+/g, "-")} />}>{main}</PageTwoColRight>;
}

function ProfilePage() {
  const { goToCompany } = React.useContext(NavContext);
  const stuck = useStuck(300);
  const co = (name) => (companyIdFor(name) ? <span onClick={() => goToCompany(companyIdFor(name))} style={{ cursor: "pointer", color: "var(--accent-fg)" }}>{name}</span> : name);
  const Entry = ({ logo, logoBg, title, sub, time, desc, skills }) => (
    <div className="entry">
      <div className="entry__logo" style={logoBg ? { background: logoBg, color: "#fff" } : undefined}>{logo}</div>
      <div style={{ flex: 1 }}>
        <div className="entry__title">{title}</div>
        {sub && <div className="entry__sub">{sub}</div>}
        {time && <div className="entry__time">{time}</div>}
        {desc && <div className="entry__desc">{desc}</div>}
        {skills && <div className="entry__skills">{skills.map((s) => <Pill key={s}>{s}</Pill>)}</div>}
      </div>
    </div>
  );
  const main = (
    <>
      <ProfileStickyHeader name="Yara Okonkwo" initials="YO" photoSeed="yara okonkwo" stuck={stuck}
        actions={<><Button variant="primary" size="sm" pill icon="work">Open to</Button><Button variant="outline" size="sm" pill icon="add">Add section</Button><MoreMenu pill /></>} />
      <Panel bare>
        <div className="profile-cover" style={{ backgroundImage: `url(${seededPhoto("yara-okonkwo-banner", 1200, 360, "banner")})`, backgroundSize: "cover", backgroundPosition: "center" }} />
        <div className="profile-header">
          <Avatar initials="YO" size={128} photo={seededPhoto("yara-okonkwo", 256, 256, "face")} />
          <div className="profile-header__name">Yara Okonkwo</div>
          <div className="profile-header__headline">Principal Designer at Davinci Systems · Helping teams build design infrastructure that doesn't rot.</div>
          <div className="profile-header__meta">
            <span><Icon name="location_on" className="text-[14px]" /> Lisbon, Portugal · {co("Davinci Systems")}</span>
            <span><Icon name="group" className="text-[14px]" /> 1,842 connections · 12k followers</span>
          </div>
          <div style={{ marginTop: 12, display: "inline-flex", alignItems: "center", gap: 8, background: "var(--accent-subtle)", color: "var(--accent-fg)", borderRadius: 8, padding: "8px 12px", fontSize: 13, fontWeight: 600 }}>
            <Icon name="work" className="text-[16px]" /> Open to work — Design Systems &amp; Product Design roles
          </div>
          <div className="profile-header__actions">
            <Button variant="primary" icon="chat_bubble">Message</Button>
            <Button variant="outline" icon="add">Follow</Button>
            <MoreMenu size="icon" />
          </div>
        </div>
      </Panel>

      <Panel title="Analytics" action={<span className="meta">Private to you</span>}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
          {[["98", "profile views", "Discover who's viewed your profile."], ["1,892", "post impressions", "Check out who's engaging with your posts."], ["27", "search appearances", "See how often you appear in search."]].map(([v, l, d]) => (
            <div key={l}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}><span className="stat__value">{v}</span><span style={{ fontSize: 13, fontWeight: 600 }}>{l}</span></div>
              <div className="meta" style={{ marginTop: 4, lineHeight: 1.4 }}>{d}</div>
            </div>
          ))}
        </div>
      </Panel>

      <Panel title="About">
        <p style={{ fontSize: 14, lineHeight: 1.6, color: "var(--fg-muted)", margin: 0 }}>
          Designer and systems thinker with 12 years of experience building design infrastructure for product teams. I care about the boring, load-bearing parts of design systems — tokens, governance, contribution models — because those are what make every other part of design feel easy.
        </p>
        <div className="entry__skills" style={{ marginTop: 14 }}>
          {["Design Systems", "Design Tokens", "Accessibility"].map((s) => <Pill key={s} variant="accent">{s}</Pill>)}
          {["Figma", "React", "Typography", "Product Strategy"].map((s) => <Pill key={s}>{s}</Pill>)}
        </div>
      </Panel>

      <Panel title="Services">
        <p style={{ fontSize: 14, lineHeight: 1.6, margin: "0 0 12px" }}>I help product teams treat their design system as a product — set up the pipeline, governance, and rituals that keep it healthy.</p>
        <div className="entry__skills">
          {["Design Systems Consulting", "Design Ops", "Workshops & Training", "Token Architecture", "Audits"].map((s) => <Pill key={s}>{s}</Pill>)}
        </div>
      </Panel>

      <Panel title="Activity" action={<Button variant="outline" size="sm" pill>Create a post</Button>}>
        <div className="meta" style={{ marginBottom: 12 }}>1,094 followers</div>
        <Tabs defaultValue="posts">
          <TabsList>
            <TabsTrigger value="posts">Posts</TabsTrigger>
            <TabsTrigger value="comments">Comments</TabsTrigger>
            <TabsTrigger value="reactions">Reactions</TabsTrigger>
          </TabsList>
          <TabsContent value="posts">
            <div className="flex flex-col gap-3">
              <Post id="yara-act-1" author="Yara Okonkwo" role="Principal Designer · Davinci Systems" time="3d" avatar="YO" photoSeed="yara okonkwo" body="The unglamorous truth about design systems: the wins compound in the docs and governance, not the component count. Shipped our contribution guide this week and adoption already feels different." reactions={317} comments={18} topReactions={["insightful", "like", "celebrate"]} />
              <Post id="yara-act-2" author="Yara Okonkwo" role="Principal Designer · Davinci Systems" time="1w" avatar="YO" photoSeed="yara okonkwo" body="Reposting a great thread on surface hierarchy — exactly how we think about Canvas → Container → grouping at Davinci." reactions={142} comments={6} topReactions={["like", "love"]} />
            </div>
          </TabsContent>
          <TabsContent value="comments">
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                { on: "Sofia Antonova's post", text: "This matches our experience exactly — the focus ring work paid off more than any net-new component.", time: "2d" },
                { on: "a post in Design Systems", text: "We lint alias-level overrides too. Game changer for keeping the global scale clean.", time: "5d" },
              ].map((c, i) => (
                <div key={i} style={{ fontSize: 13 }}>
                  <div className="meta" style={{ marginBottom: 2 }}>Commented on {c.on} · {c.time}</div>
                  <div style={{ color: "var(--fg-muted)", lineHeight: 1.5 }}>“{c.text}”</div>
                </div>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="reactions">
            <div className="meta">Reacted to 14 posts this month — mostly <Icon name="lightbulb" filled className="text-[14px]" style={{ color: "var(--amber-9)", verticalAlign: "middle" }} /> Insightful.</div>
          </TabsContent>
        </Tabs>
      </Panel>

      <Panel title="Experience">
        {[
          { logo: "DV", logoBg: "var(--blue-9)", title: "Principal Designer", sub: co("Davinci Systems"), time: "2022 – Present · 4 yrs", desc: "Lead design system and brand systems across the Davinci product suite. Built a token pipeline 40+ teams consume.", skills: ["Design Systems", "Tokens", "Leadership"] },
          { logo: "HX", logoBg: "var(--teal-9)", title: "Senior Product Designer", sub: co("Helix Systems"), time: "2019 – 2022 · 3 yrs", desc: "Owned end-to-end redesign of the primary dashboard; partnered with eng on a React component library.", skills: ["Product Design", "React", "Figma"] },
          { logo: "NV", title: "Product Designer", sub: "Novatech", time: "2015 – 2019 · 4 yrs", desc: "Shipped consumer features across web and iOS; built the first internal component library.", skills: ["iOS", "Web"] },
        ].map((e, i) => <Entry key={i} {...e} />)}
      </Panel>

      <Panel title="Education">
        <Entry logo="RC" title="Royal College of Art" sub="MA, Communication Design" time="2013 – 2015" desc="Graduated with Distinction. Thesis on systems thinking in interface design." />
        <Entry logo="UL" title="University of Lagos" sub="BSc, Computer Science" time="2009 – 2013" />
      </Panel>

      <Panel title="Projects">
        <Entry logo="DV" logoBg="var(--blue-9)" title="Davinci Token Pipeline" time="2022 – Present" desc="A Radix-based token system + Figma sync consumed by 40+ product teams. Zero-config theming and lint-enforced overrides." />
        <Entry logo="OS" title="Open Surface Guidelines" time="2023" desc="A public playbook for surface hierarchy and elevation, adopted across the design community." />
      </Panel>

      <Panel title="Skills">
        <div className="entry__skills">
          {["Design Systems", "Design Tokens", "Figma", "React", "TypeScript", "Accessibility (WCAG)", "Design Ops", "Typography", "Governance", "Component API Design"].map((s) => <Pill key={s} variant="accent">{s}</Pill>)}
        </div>
      </Panel>

      <Panel title="Recommendations">
        {[
          { name: "Miriam Chen", role: "VP Design · Helix", text: "Yara is the rare designer who makes the boring parts of a system feel exciting. Our token sprawl dropped by half under her guidance." },
          { name: "Daniel Amrani", role: "Head of Brand · Pylon", text: "Equal parts systems thinker and craftsperson. Every handoff was airtight and every rationale documented." },
        ].map((r, i) => (
          <div key={i} className="entry">
            <Avatar initials={r.name.slice(0, 2).toUpperCase()} size={48} variant="g4" photoSeed={r.name} />
            <div style={{ flex: 1 }}>
              <div className="entry__title">{r.name}</div>
              <div className="entry__time">{r.role}</div>
              <div className="entry__desc">“{r.text}”</div>
            </div>
          </div>
        ))}
      </Panel>

      <Panel title="Patents">
        <Entry logo="" title="System and method for token-driven theme resolution" sub="US 11,842,019 · Granted 2023" desc="A method for resolving design tokens across themes with lint-enforced alias overrides." />
      </Panel>

      <Panel title="Courses">
        {[["Advanced Design Systems", "Royal College of Art"], ["Accessibility Engineering", "Davinci Learning"], ["Type Design Fundamentals", "Type@Cooper"]].map(([t, sub]) => (
          <Entry key={t} logo="" title={t} sub={sub} />
        ))}
      </Panel>

      <Panel title="Languages">
        {[["English", "Native or bilingual proficiency"], ["Portuguese", "Professional working proficiency"], ["Yoruba", "Native or bilingual proficiency"]].map(([l, p]) => (
          <div key={l} className="detail-row"><div className="detail-row__value" style={{ fontWeight: 600 }}>{l}</div><div className="meta">{p}</div></div>
        ))}
      </Panel>

      <Panel title="Interests" bodyStyle={{ padding: 0 }}>
        {[
          { n: "Helix Systems", r: "24,802 followers", i: "HX", v: "g2", company: true },
          { n: "Atlas Docs", r: "214,882 followers", i: "AT", v: "g5", company: true },
          { n: "Design Systems Guild", r: "28,402 members", i: "DS", v: "g4" },
        ].map((p, i) => {
          const cid = p.company ? companyIdFor(p.n) : null;
          return (
            <div key={i} className="rail-item" onClick={cid ? () => goToCompany(cid) : undefined} style={cid ? { cursor: "pointer" } : undefined}>
              <Avatar initials={p.i} size={40} variant={p.v} bg={COMPANIES[cid]?.logoBg} photoSeed={p.company ? null : p.n} photo={p.company ? brandLogo(p.n) : undefined} shape={p.company ? "rounded" : "circle"} />
              <div className="rail-item__text"><div className="rail-item__title">{p.n}</div><div className="rail-item__sub">{p.r}</div></div>
              <Button variant="outline" size="sm" pill icon="add" onClick={(e) => e.stopPropagation()}>Follow</Button>
            </div>
          );
        })}
      </Panel>

      <Panel title="Causes">
        <div className="entry__skills">{["Education", "Science and Technology", "Social Services", "Arts and Culture"].map((s) => <Pill key={s}>{s}</Pill>)}</div>
      </Panel>
    </>
  );
  return <PageTwoColRight right={<ProfileRail />}>{main}</PageTwoColRight>;
}

/* ============================ Company ============================ */
function MoreMenu({ size = "icon-sm", pill = false }) {
  return (
    <DropdownMenu>
      <Tip label="More">
        <DropdownMenuTrigger asChild>
          <Button variant="secondary" size={size} pill={pill} aria-label="More actions"><Icon name="more_horiz" /></Button>
        </DropdownMenuTrigger>
      </Tip>
      <DropdownMenuContent align="end">
        <DropdownMenuItem><Icon name="open_in_new" className="text-[18px] me-1" /> Visit website</DropdownMenuItem>
        <DropdownMenuItem><Icon name="send" className="text-[18px] me-1" /> Send in a message</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem><Icon name="flag" className="text-[18px] me-1" /> Report abuse</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function CompanySubnav({ c, tabs, tab, setTab, stuck }) {
  return (
    <div className={`company-subnav ${stuck ? "is-stuck" : ""}`}>
      <div className="company-subnav__id">
        <Avatar size={28} shape="rounded" photo={brandLogo(c.name)} initials={c.initials} bg={c.logoBg} ring={false} />
        <span className="company-subnav__name">{c.name}</span>
      </div>
      <nav className="company-tabs">
        {tabs.map((t) => (
          <button key={t} className={`company-tab ${tab === t.toLowerCase() ? "active" : ""}`} onClick={() => setTab(t.toLowerCase())}>{t}</button>
        ))}
      </nav>
      <div className="company-subnav__actions">
        <MoreMenu pill />
        <Button variant="primary" size="sm" pill icon="add">Follow</Button>
      </div>
    </div>
  );
}

function CompanyRail({ c, goToCompany }) {
  const others = Object.values(COMPANIES).filter((x) => x.id !== c.id);
  const Mod = ({ title, sub, rows }) => (
    <Panel title={title} bodyStyle={{ padding: 0 }}>
      {sub && <div style={{ fontSize: 11, color: "var(--fg-muted)", padding: "0 16px 8px" }}>{sub}</div>}
      {rows.map(([name, kind], i) => {
        const id = companyIdFor(name);
        return (
          <div key={i} className="rail-item" onClick={id ? () => goToCompany(id) : undefined} style={id ? { cursor: "pointer" } : undefined}>
            <Avatar initials={name.slice(0, 2).toUpperCase()} size={40} variant="g2" shape="rounded" photo={brandLogo(name)} bg={COMPANIES[id]?.logoBg} />
            <div className="rail-item__text"><div className="rail-item__title">{name}</div><div className="rail-item__sub">{kind}</div></div>
            <Button variant="outline" size="sm" pill icon="add" onClick={(e) => e.stopPropagation()}>Follow</Button>
          </div>
        );
      })}
    </Panel>
  );
  return (
    <aside className="hidden flex-col gap-3 lg:flex">
      <Panel title="Pages people also viewed" bodyStyle={{ padding: 0 }}>
        {others.map((x) => (
          <div key={x.id} className="rail-item" onClick={() => goToCompany(x.id)} style={{ cursor: "pointer" }}>
            <Avatar initials={x.initials} size={40} shape="rounded" photo={brandLogo(x.name)} bg={x.logoBg} />
            <div className="rail-item__text"><div className="rail-item__title">{x.name}</div><div className="rail-item__sub">{x.industry}</div></div>
            <Button variant="outline" size="sm" pill icon="add" onClick={(e) => e.stopPropagation()}>Follow</Button>
          </div>
        ))}
      </Panel>
      <Mod title="Products people also use" rows={GENERIC.rail.alsoUse} />
      <Mod title="People also follow" rows={GENERIC.rail.alsoFollow} />
      <RailFooter />
    </aside>
  );
}

function CompanyPage({ companyId = "davinci", goToCompany }) {
  const c = COMPANIES[companyId] || COMPANIES.davinci;
  const [tab, setTab] = useState("home");
  const [stuck, setStuck] = useState(false);
  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 230);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => { setTab("home"); window.scrollTo({ top: 0 }); }, [companyId]);

  const TABS = ["Home", "About", "Products", "Posts", "Jobs", "People", "Insights"];
  const postProps = (p) => ({
    id: p.id, author: c.name, role: `${c.followers} followers`, time: p.time, avatar: c.initials, isCompany: true, bg: c.logoBg,
    body: p.body, attachment: p.attachment ? { title: p.attachment.title, sub: p.attachment.sub, image: seededPhoto(p.attachment.image, 480, 240, "article") } : undefined,
    reactions: p.reactions, comments: p.comments, topReactions: ["like", "celebrate", "support"],
  });

  // Pad to a consistent, "lived-in" density across every company.
  const densePosts = [...c.posts, ...GENERIC.fillerPosts.map((p, i) => ({ id: `${c.id}-f${i}`, time: ["6h", "2d", "1w", "2w"][i] || "1w", ...p }))].slice(0, 4);
  const denseJobs = [...c.jobs, ...GENERIC.fillerJobs].slice(0, 5);
  const customers = Object.values(COMPANIES).filter((x) => x.id !== c.id);
  const stats = [["employees", c.employees], ["founded", c.founded], ["open roles", String(denseJobs.length)], ["followers", c.followers]];

  const companyRow = (x) => (
    <div key={x.id} className="rail-item" onClick={() => goToCompany(x.id)} style={{ cursor: "pointer" }}>
      <Avatar initials={x.initials} size={44} shape="rounded" photo={brandLogo(x.name)} bg={x.logoBg} />
      <div className="rail-item__text"><div className="rail-item__title">{x.name}</div><div className="rail-item__sub">{x.industry} · {x.followers} followers</div></div>
      <Button variant="outline" size="sm" pill icon="add" onClick={(e) => e.stopPropagation()}>Follow</Button>
    </div>
  );

  const homeTab = (
    <>
      <Panel title="Overview" action={<Button variant="ghost" size="sm" onClick={() => setTab("about")}>Show all details</Button>}>
        <p style={{ fontSize: 14, lineHeight: 1.6, color: "var(--fg-muted)", margin: "0 0 16px" }}>{c.about}</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
          {stats.map(([v, l]) => <div className="stat" key={l}><div className="stat__value">{v}</div><div className="stat__label">{l}</div></div>)}
        </div>
      </Panel>
      <div>
        <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15, margin: "2px 2px 8px" }}>Page posts</div>
        <div className="flex flex-col gap-3">{densePosts.slice(0, 3).map((p) => <Post key={p.id} {...postProps(p)} />)}</div>
      </div>
      <Panel title="Products" action={<Button variant="ghost" size="sm" onClick={() => setTab("products")}>Show all</Button>}>
        <div style={{ fontWeight: 600 }}>{c.product.name}</div>
        <p style={{ fontSize: 13, color: "var(--fg-muted)", marginTop: 4 }}>{c.product.desc}</p>
      </Panel>
      <Panel title="People highlights" bodyStyle={{ padding: 0 }}>
        {GENERIC.pymk.slice(0, 3).map((p, i) => (
          <div key={i} className="rail-item">
            <Avatar initials={p.name.slice(0, 2).toUpperCase()} size={44} photoSeed={p.name} />
            <div className="rail-item__text"><div className="rail-item__title">{p.name}</div><div className="rail-item__sub">{p.role} · {c.name}</div></div>
            <Button variant="outline" size="sm" pill>Message</Button>
          </div>
        ))}
      </Panel>
      <Panel title="Recent job openings" action={<Button variant="ghost" size="sm" onClick={() => setTab("jobs")}>Show all jobs</Button>} bodyStyle={{ padding: 0 }}>
        {denseJobs.slice(0, 3).map(([title, loc, posted], i) => (
          <div key={i} className="entry" style={{ alignItems: "center", padding: "12px 16px", borderBottom: i < 2 ? "1px solid var(--border-subtle)" : "none" }}>
            <Avatar initials={c.initials} size={40} shape="rounded" photo={brandLogo(c.name)} bg={c.logoBg} />
            <div style={{ flex: 1 }}><div className="entry__title">{title}</div><div className="entry__time">{loc} · {posted}</div></div>
          </div>
        ))}
      </Panel>
      <Panel title="Events">
        <div className="flex flex-col gap-3">
          {GENERIC.events.map((e, i) => (
            <div key={i} style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <div style={{ width: 44, height: 44, borderRadius: 8, background: "var(--bg-subtle)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--accent-fg)" }}><Icon name="event" /></div>
              <div style={{ flex: 1 }}><div className="entry__title">{e.title}</div><div className="entry__time">{e.date} · {e.attendees} attendees</div></div>
              <Button variant="outline" size="sm" pill>View</Button>
            </div>
          ))}
        </div>
      </Panel>
      <Panel title="Featured customers" bodyStyle={{ padding: 0 }}>
        {customers.slice(0, 4).map((x) => companyRow(x))}
      </Panel>
    </>
  );

  const aboutTab = (
    <>
      <Panel title="Overview">
        <p style={{ fontSize: 14, lineHeight: 1.6, color: "var(--fg-muted)", margin: "0 0 8px" }}>{c.about}</p>
        {[["Website", c.website], ["Industry", c.industry], ["Company size", c.size], ["Headquarters", c.location], ["Founded", c.founded], ["Specialties", c.specialties.join(", ")]].map(([l, v]) => (
          <div key={l} className="detail-row"><div className="detail-row__label">{l}</div><div className="detail-row__value">{v}</div></div>
        ))}
      </Panel>
      <Panel title={`Locations (${(COMPANY_LOCATIONS[c.id] || []).length})`}>
        <div style={{ fontSize: 13, color: "var(--fg-muted)", marginBottom: 10 }}>Hover a marker to explore each location.</div>
        <LocationsMap locations={COMPANY_LOCATIONS[c.id] || []} />
      </Panel>
    </>
  );

  const productsTab = (
    <>
      <Panel title={`What is ${c.name}?`}><p style={{ fontSize: 14, lineHeight: 1.6, margin: 0 }}>{c.product.desc}</p></Panel>
      <Panel title="Plans and pricing">
        <div className="pricing-grid">
          {c.product.pricing.map(([tier, price, blurb]) => (
            <div key={tier} className="pricing-card">
              <div style={{ fontWeight: 600 }}>{tier}</div>
              <div className="pricing-card__price">{price}</div>
              <div style={{ fontSize: 12, color: "var(--fg-muted)" }}>{blurb}</div>
            </div>
          ))}
        </div>
      </Panel>
      <Panel title="Top rated features">
        <div className="feature-grid">{c.product.features.map((f) => <div key={f} className="feature-card"><div style={{ fontWeight: 600, fontSize: 13 }}>{f}</div></div>)}</div>
      </Panel>
    </>
  );

  const postsTab = <div className="flex flex-col gap-3">{densePosts.map((p) => <Post key={p.id} {...postProps(p)} />)}</div>;

  const jobsTab = (
    <Panel title={`${c.name} has ${denseJobs.length} open roles`} bodyStyle={{ padding: 0 }}>
      {denseJobs.map(([title, loc, posted], i) => (
        <div key={i} className="entry" style={{ alignItems: "center", padding: "14px 16px", borderBottom: i < denseJobs.length - 1 ? "1px solid var(--border-subtle)" : "none" }}>
          <Avatar initials={c.initials} size={48} shape="rounded" photo={brandLogo(c.name)} bg={c.logoBg} />
          <div style={{ flex: 1 }}><div className="entry__title">{title}</div><div className="entry__sub">{c.name}</div><div className="entry__time">{loc} · {posted}</div></div>
          <Button variant="outline" size="sm" pill>Easy apply</Button>
        </div>
      ))}
    </Panel>
  );

  const peopleTab = (
    <>
      <Panel title={`${c.employees} associated members`}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
          {[["Where they live", GENERIC.people.live], ["Where they studied", GENERIC.people.studied]].map(([label, rows]) => {
            const max = Math.max(...rows.map((r) => r[1]));
            return (
              <div key={label}>
                <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 10 }}>{label}</div>
                {rows.map(([name, n]) => (
                  <div key={name} style={{ marginBottom: 10 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}><span>{name}</span><span className="meta">{n}</span></div>
                    <div className="stat-bar" style={{ width: `${(n / max) * 100}%` }} />
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </Panel>
      <Panel title="People you may know">
        <div className="network-grid">
          {GENERIC.people.pymk.map((p, i) => (
            <div key={i} className="suggestion-card">
              <div className="suggestion-card__cover" style={{ backgroundImage: `url(${seededPhoto(p.seed + "-banner", 240, 56, "banner")})`, backgroundSize: "cover", backgroundPosition: "center" }} />
              <Avatar initials={p.name.slice(0, 2).toUpperCase()} size={64} photoSeed={p.name} style={{ border: "3px solid var(--bg-surface)", marginTop: -32, position: "relative" }} />
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 14, marginTop: 8, textAlign: "center" }}>{p.name}</div>
              <div style={{ fontSize: 12, color: "var(--fg-muted)", textAlign: "center", minHeight: 28, padding: "0 8px" }}>{p.role}</div>
              <div style={{ padding: "10px 12px 14px", width: "100%", boxSizing: "border-box" }}><Button variant="outline" size="sm" pill icon="add" style={{ width: "100%" }}>Connect</Button></div>
            </div>
          ))}
        </div>
      </Panel>
    </>
  );

  const ins = GENERIC.insights;
  const insightsTab = (
    <>
      <Panel title="Hiring trends">
        <p style={{ fontSize: 13, color: "var(--fg-muted)", lineHeight: 1.6, margin: "0 0 12px" }}>{ins.hiringBlurb}</p>
        <div style={{ display: "flex", gap: 32 }}>
          <div><div style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 800 }}>{ins.newHires}</div><div className="meta">New hires</div></div>
          <div><div style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 800, color: "var(--success-fg)" }}>{ins.growth}</div><div className="meta">6-month growth</div></div>
        </div>
      </Panel>
      <Panel title="Total employee count">
        <div style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 800 }}>{c.employees}</div>
        <div className="meta">Median tenure · {ins.tenure}</div>
      </Panel>
      <Panel title="Headcount growth by function">
        {ins.functions.map(([f, g]) => (<div key={f} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", fontSize: 13, borderBottom: "1px solid var(--border-subtle)" }}><span>{f}</span><span style={{ color: "var(--success-fg)", fontWeight: 600 }}>{g}</span></div>))}
      </Panel>
      <Panel title="Notable alumni">
        {ins.alumni.map((a, i) => (<div key={i} className="entry" style={{ alignItems: "center" }}><Avatar initials={a.name.slice(0, 2).toUpperCase()} size={44} photoSeed={a.seed} /><div style={{ flex: 1 }}><div className="entry__title">{a.name}</div><div className="entry__time">{a.role} · {a.was} at {c.name}</div></div></div>))}
      </Panel>
      <Panel title="Competitors" bodyStyle={{ padding: 0 }}>
        {c.competitors.map(([name, kind], i) => { const id = companyIdFor(name); return (
          <div key={i} className="rail-item" onClick={id ? () => goToCompany(id) : undefined} style={id ? { cursor: "pointer" } : undefined}>
            <Avatar initials={name.slice(0, 2).toUpperCase()} size={40} variant="g5" bg={COMPANIES[id]?.logoBg} style={{ borderRadius: 8 }} />
            <div className="rail-item__text"><div className="rail-item__title">{name}</div><div className="rail-item__sub">{kind}</div></div>
            <Button variant="outline" size="sm" pill icon="add">Follow</Button>
          </div>
        ); })}
      </Panel>
    </>
  );

  const content = { home: homeTab, about: aboutTab, products: productsTab, posts: postsTab, jobs: jobsTab, people: peopleTab, insights: insightsTab }[tab] || homeTab;

  return (
    <div className="flex flex-col">
        <Panel bare className="company-hero">
          <div className="profile-cover" style={{ height: 130, backgroundImage: `url(${seededPhoto(c.coverSeed, 1200, 300, c.coverKind || "office")})`, backgroundSize: "cover", backgroundPosition: "center" }} />
          <div style={{ padding: "0 24px 16px", marginTop: -40, position: "relative" }}>
            <Avatar size={88} shape="rounded" photo={brandLogo(c.name)} initials={c.initials} bg={c.logoBg} />
            <div style={{ display: "flex", justifyContent: "space-between", gap: 16, alignItems: "flex-end", flexWrap: "wrap", marginTop: 12 }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}><span className="profile-header__name">{c.name}</span>{c.verified && <Icon name="verified" className="text-[18px]" style={{ color: "var(--accent-fg)" }} />}<StatusBadge status="hiring" /></div>
                <div style={{ fontSize: 14, marginTop: 4 }}>{c.tagline}</div>
                <div className="profile-header__meta"><span>{c.industry}</span><span>{c.location}</span><span style={{ color: "var(--accent-fg)", fontWeight: 600 }}>{c.followers} followers</span></div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--fg-muted)", marginTop: 8 }}>
                  <Avatar initials="KB" size={20} photoSeed="kaique borges" /> Kaique & 11 other connections follow this page
                </div>
              </div>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <MoreMenu size="icon" />
                <Button variant="outline" icon="chat_bubble">Message</Button>
                <Button variant="primary" icon="add">Follow</Button>
              </div>
            </div>
          </div>
        </Panel>
        <CompanySubnav c={c} tabs={TABS} tab={tab} setTab={setTab} stuck={stuck} />
        <div className="mt-3 grid grid-cols-1 gap-3 lg:grid-cols-[minmax(0,1fr)_300px]">
          <div className="flex min-w-0 flex-col gap-3">{content}</div>
          <CompanyRail c={c} goToCompany={goToCompany} />
        </div>
    </div>
  );
}

/* ============================ Network ============================ */
function NetworkNavItem({ icon, label, count }) {
  return (
    <div className="network-nav-item">
      <Icon name={icon} className="text-[18px] text-[var(--fg-muted)]" />
      <div style={{ flex: 1, minWidth: 0, fontSize: 13, fontWeight: 500 }}>{label}</div>
      <span className="meta" style={{ fontWeight: 600, color: "var(--fg)" }}>{count}</span>
    </div>
  );
}
function SuggestionCard({ person }) {
  const { goToProfile } = React.useContext(NavContext);
  const [state, setState] = useState("idle"); // idle | pending | dismissed
  if (state === "dismissed") return null;
  return (
    <div className="suggestion-card" style={{ position: "relative", cursor: "pointer" }} onClick={() => goToProfile({ name: person.name, role: person.role, photoSeed: person.name, variant: person.variant, avatar: person.avatar })}>
      <button className="suggestion-card__dismiss" aria-label="Dismiss" onClick={(e) => { e.stopPropagation(); setState("dismissed"); }}><Icon name="close" size="sm" /></button>
      <div className="suggestion-card__cover" style={{ backgroundImage: `url(${seededPhoto(person.name + "-banner", 240, 56, "banner")})`, backgroundSize: "cover", backgroundPosition: "center" }} />
      <Avatar initials={person.avatar} size={72} variant={person.variant} photoSeed={person.name} style={{ marginTop: -36, position: "relative" }} />
      <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 14, marginTop: 8, textAlign: "center", padding: "0 8px" }}>{person.name}</div>
      <div style={{ fontSize: 12, color: "var(--fg-muted)", textAlign: "center", marginTop: 2, minHeight: 32, lineHeight: 1.35, padding: "0 8px" }}>{person.role}</div>
      <div className="meta" style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 6, justifyContent: "center", padding: "0 8px" }}>
        <Avatar size={16} photoSeed={person.name + "-m"} /> {person.mutual} mutual connections
      </div>
      <div style={{ padding: "12px 12px 14px", width: "100%", boxSizing: "border-box" }}>
        <Button variant={state === "pending" ? "secondary" : "outline"} size="sm" pill icon={state === "pending" ? "check" : "add"} style={{ width: "100%" }} onClick={(e) => { e.stopPropagation(); setState((s) => (s === "pending" ? "idle" : "pending")); }}>{state === "pending" ? "Pending" : "Connect"}</Button>
      </div>
    </div>
  );
}
const NETWORK_PEOPLE = [
  { name: "Stuart Bayston", role: "Design Lead · Aston (ex-Google)", mutual: 11, avatar: "SB", variant: "g5" },
  { name: "Justin Cohen", role: "Product Design at Plaid", mutual: 11, avatar: "JC", variant: "g2" },
  { name: "Mallory Dean", role: "Designer Advocate at Figma", mutual: 17, avatar: "MD", variant: "g4" },
  { name: "Colin Robins", role: "Senior Experience Design Consultant", mutual: 1, avatar: "CR", variant: "g6" },
  { name: "Dimitri Otero", role: "Design Systems · helping product teams ship", mutual: 32, avatar: "DO", variant: "g1" },
  { name: "Amy Wong", role: "Brand & Creative @ Plaid", mutual: 6, avatar: "AW", variant: "g4" },
  { name: "Gili Boker", role: "Senior Director of Product Design", mutual: 6, avatar: "GB", variant: "g5" },
  { name: "Shamus Scott Grubb", role: "Principal Product Designer at Davinci", mutual: 15, avatar: "SG", variant: "g6" },
  { name: "Xavier Rivera", role: "Award-Winning Senior Art Director", mutual: 3, avatar: "XR", variant: "g1" },
  { name: "Rami Moghadam", role: "Creative Director, ESPN", mutual: 2, avatar: "RM", variant: "g4" },
  { name: "Nick Gawith", role: "EVP, Executive Creative Director", mutual: 4, avatar: "NG", variant: "g5" },
  { name: "Phillip Golub", role: "Experience Transformation Leader", mutual: 12, avatar: "PG", variant: "g2" },
  { name: "Steve Witmer", role: "Design Engineer & Technologist", mutual: 32, avatar: "SW", variant: "g2" },
  { name: "Kevin Muldoon", role: "Design Systems Architect & Writer", mutual: 55, avatar: "KM", variant: "g6" },
  { name: "Josh Silverman", role: "Designer, entrepreneur, educator", mutual: 21, avatar: "JS", variant: "g1" },
  { name: "Catherine Cakir", role: "VP, Operations at BranchLab", mutual: 3, avatar: "CC", variant: "g4" },
];
function NetworkPage() {
  const [tab, setTab] = useState("grow");
  const sidebar = [
    ["group", "Connections", "1,092"],
    ["person", "Following & followers", ""],
    ["groups", "Groups", "7"],
    ["event", "Events", "4"],
    ["article", "Pages", "58"],
    ["newspaper", "Newsletters", "3"],
  ];
  const Section = ({ title, people }) => (
    <Panel title={title} action={<Button variant="ghost" size="sm">Show all</Button>} bodyStyle={{ padding: 16 }}>
      <div className="network-grid">{people.map((p, i) => <SuggestionCard key={`${title}-${i}`} person={p} />)}</div>
    </Panel>
  );
  return (
    <PageTwoColLeft left={<>
        <Panel title="Manage my network" bodyStyle={{ padding: 6 }}>
          <ul className="nav-list">
            {sidebar.map(([ic, label, count]) => (
              <li key={label}><Icon name={ic} /> {label} {count && <span className="count">{count}</span>}</li>
            ))}
          </ul>
        </Panel>
        <RailAd ad={AD_LIBRARY.course} />
        <RailFooter />
      </>}>
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList variant="line" className="w-full justify-start rounded-none border-b border-[var(--border-subtle)] px-1">
            <TabsTrigger value="grow" className="flex-none px-3.5">Grow</TabsTrigger>
            <TabsTrigger value="catchup" className="flex-none px-3.5">Catch up</TabsTrigger>
          </TabsList>
        </Tabs>
        <Panel bodyStyle={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontWeight: 600 }}>No pending invitations</span>
          <Button variant="ghost" size="sm">Manage</Button>
        </Panel>
        <InlineAd ad={AD_LIBRARY.recruit} />
        <Section title="People you may know based on your recent activity" people={NETWORK_PEOPLE.slice(0, 4)} />
        <Section title="Adam Romanski's connections you may know" people={NETWORK_PEOPLE.slice(4, 8)} />
        <Section title="People in the Design Systems community" people={NETWORK_PEOPLE.slice(8, 12)} />
        <Section title="Suggestions for you" people={NETWORK_PEOPLE.slice(12, 16)} />
    </PageTwoColLeft>
  );
}

/* ============================ Jobs ============================ */
function ApplyDialog({ job }) {
  const [open, setOpen] = useState(false);
  const [done, setDone] = useState(false);
  const submit = () => { setDone(true); setTimeout(() => { setOpen(false); setDone(false); }, 1400); };
  return (
    <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) setDone(false); }}>
      <DialogTrigger asChild>
        <Button variant="primary" pill iconRight="arrow_forward">{job.easyApply ? "Easy Apply" : "Apply"}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[520px]">
        {done ? (
          <div style={{ textAlign: "center", padding: "24px 8px" }}>
            <Icon name="check_circle" filled className="text-[44px]" style={{ color: "var(--success-fg)" }} />
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, marginTop: 8 }}>Application sent</div>
            <div style={{ fontSize: 13, color: "var(--fg-muted)", marginTop: 4 }}>{job.company} will review your application.</div>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Apply to {job.title}</DialogTitle>
              <DialogDescription>{job.company} · {job.location}</DialogDescription>
            </DialogHeader>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <Field label="Full name"><Input defaultValue="Yara Okonkwo" /></Field>
              <Field label="Email"><Input type="email" defaultValue="yara@davinci.systems" /></Field>
              <Field label="Phone"><Input type="tel" placeholder="+351 …" /></Field>
              <Field label="Cover note (optional)"><Textarea rows={3} placeholder={`Why you're a great fit for ${job.company}…`} /></Field>
              <button type="button" className="flex items-center gap-2 text-sm" style={{ color: "var(--accent-fg)" }}>
                <Icon name="upload_file" className="text-[18px]" /> Attach résumé — Yara_Okonkwo_CV.pdf
              </button>
            </div>
            <DialogFooter>
              <DialogClose asChild><Button variant="secondary" size="sm">Cancel</Button></DialogClose>
              <Button variant="primary" size="sm" pill onClick={submit}>Submit application</Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

function JobFiltersSheet({ count }) {
  return (
    <Sheet>
      <Tip label="Filter jobs">
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon-sm" icon="tune" aria-label="Filter jobs" />
        </SheetTrigger>
      </Tip>
      <SheetContent side="right" className="w-[340px] sm:max-w-[340px]">
        <SheetHeader>
          <SheetTitle>Filter jobs</SheetTitle>
          <SheetDescription>{count} roles match your profile.</SheetDescription>
        </SheetHeader>
        <div style={{ display: "flex", flexDirection: "column", gap: 16, padding: "0 16px", overflowY: "auto" }}>
          <Field label="Date posted">
            <Select defaultValue="week">
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Past 24 hours</SelectItem>
                <SelectItem value="week">Past week</SelectItem>
                <SelectItem value="month">Past month</SelectItem>
                <SelectItem value="any">Any time</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field label="Experience level">
            <Select defaultValue="senior">
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="mid">Mid-Senior</SelectItem>
                <SelectItem value="senior">Senior</SelectItem>
                <SelectItem value="staff">Staff +</SelectItem>
                <SelectItem value="lead">Lead / Principal</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <SettingRow label="Remote only" desc="Hide on-site roles" defaultChecked />
          <SettingRow label="Easy Apply" desc="One-click applications" defaultChecked />
          <SettingRow label="Under 10 applicants" desc="Less competition" />
          <SettingRow label="In your network" desc="Companies where you have a connection" />
        </div>
        <SheetFooter>
          <SheetClose asChild><Button variant="primary" pill style={{ width: "100%" }}>Show {count} jobs</Button></SheetClose>
          <Button variant="ghost" size="sm">Reset filters</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

function JobsPage() {
  const { goToCompany } = React.useContext(NavContext);
  const [selected, setSelected] = useState(0);
  const [saved, setSaved] = useState(new Set([1]));
  const jobs = [
    { id: 0, title: "Staff Product Designer", company: "Helix Systems", logo: "HX", variant: "g2", location: "Lisbon or Remote · EU", salary: "€110k – €140k · Equity", posted: "5 days ago", applicants: "48 applicants", remote: true, easyApply: true, about: "We're looking for a staff-level designer to lead our design platform — the tokens, components, and docs that power every product surface at Helix.", fits: ["Your skills match 8 of 10 requirements", "Your connections can refer you", "3 people from your network work here"] },
    { id: 1, title: "Senior Design Engineer", company: "Atlas Docs", logo: "AT", variant: "g5", location: "Remote · Americas", salary: "$170k – $210k", posted: "2 days ago", applicants: "124 applicants", remote: true, easyApply: true, about: "Build the interactive canvas at the heart of Atlas. You'll work across React, typography, and performance.", fits: ["Your skills match 9 of 10 requirements"] },
    { id: 2, title: "Design Systems Lead", company: "Vector Project OS", logo: "VE", variant: "g6", location: "Amsterdam, NL (hybrid)", salary: "€95k – €125k", posted: "1 week ago", applicants: "63 applicants", easyApply: false, about: "Own Vector's design system end to end. Partner with product leads to scale our visual language.", fits: [] },
    { id: 3, title: "Staff Brand Designer", company: "Pulse Meetings", logo: "PU", variant: "g1", location: "New York, NY · Hybrid", salary: "$165k – $195k", posted: "3 days ago", applicants: "87 applicants", easyApply: true, about: "Define the visual identity of Pulse's next chapter.", fits: ["Your skills match 7 of 10 requirements"] },
  ];
  const current = jobs[selected];
  const toggleSave = (id) => setSaved((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });
  return (
    <div style={{ display: "grid", gridTemplateColumns: "380px 1fr", gap: 16, alignItems: "start" }}>
      <Panel title="Top picks for you" action={<JobFiltersSheet count={jobs.length} />} bodyStyle={{ padding: 0 }}>
        <div className="jobs-list">
          {jobs.map((j) => (
            <button key={j.id} type="button" className={`job-row ${selected === j.id ? "active" : ""}`} onClick={() => setSelected(j.id)}>
              <Avatar initials={j.logo} size={48} variant={j.variant} style={{ borderRadius: 8 }} />
              <div style={{ flex: 1, minWidth: 0, textAlign: "left" }}>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 14, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{j.title}</div>
                <div style={{ fontSize: 12, color: "var(--fg-muted)" }}>{companyIdFor(j.company) ? <span onClick={(e) => { e.stopPropagation(); goToCompany(companyIdFor(j.company)); }} style={{ cursor: "pointer" }}>{j.company}</span> : j.company}</div>
                <div style={{ fontSize: 11, color: "var(--fg-subtle)", marginTop: 2 }}>{j.location}</div>
                <div style={{ display: "flex", gap: 6, marginTop: 6, flexWrap: "wrap" }}>{j.easyApply && <Pill variant="accent">Easy Apply</Pill>}{j.remote && <Pill>Remote</Pill>}</div>
              </div>
              <span role="button" className={`job-save ${saved.has(j.id) ? "active" : ""}`} onClick={(e) => { e.stopPropagation(); toggleSave(j.id); }} aria-label="Save"><Icon name="bookmark" filled={saved.has(j.id)} className="text-[18px]" /></span>
            </button>
          ))}
        </div>
      </Panel>
      <Panel title="Job details" action={<span className="meta">{current.posted}</span>}>
        <div style={{ padding: 24 }}>
          <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
            <Avatar initials={current.logo} size={64} variant={current.variant} style={{ borderRadius: 10 }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700, letterSpacing: "-0.01em" }}>{current.title}</div>
              <div style={{ fontSize: 14, marginTop: 2 }}>{companyIdFor(current.company) ? <span onClick={() => goToCompany(companyIdFor(current.company))} style={{ cursor: "pointer", color: "var(--accent-fg)" }}>{current.company}</span> : current.company}</div>
              <div style={{ fontSize: 13, color: "var(--fg-muted)", marginTop: 2 }}>{current.location}</div>
              <div style={{ fontSize: 12, color: "var(--fg-subtle)", marginTop: 6, display: "flex", gap: 10 }}><span>{current.posted}</span><span>·</span><span>{current.applicants}</span><span>·</span><span>{current.salary}</span></div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
            <ApplyDialog job={current} />
            <Button variant={saved.has(current.id) ? "secondary" : "outline"} pill icon={saved.has(current.id) ? "check" : "bookmark"} onClick={() => toggleSave(current.id)}>{saved.has(current.id) ? "Saved" : "Save"}</Button>
          </div>
          {current.fits.length > 0 && (
            <div style={{ marginTop: 20 }}>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 13, marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}><Icon name="check" className="text-[14px]" style={{ color: "var(--success-fg)" }} /> How you fit</div>
              {current.fits.map((f, i) => (<div key={i} style={{ fontSize: 13, color: "var(--fg-muted)", padding: "4px 0", display: "flex", gap: 8 }}><span style={{ width: 4, height: 4, borderRadius: "50%", background: "var(--accent-fg)", marginTop: 8, flexShrink: 0 }} />{f}</div>))}
            </div>
          )}
          <Separator className="my-5" />
          <h3 style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 600, margin: "0 0 10px" }}>About the role</h3>
          <p style={{ fontSize: 14, color: "var(--fg-muted)", lineHeight: 1.55, margin: 0 }}>{current.about}</p>
        </div>
      </Panel>
    </div>
  );
}

/* ============================ Messages ============================ */
const CONVERSATIONS = [
  { id: 0, name: "Sofia Antonova", role: "Staff Designer · Helix", avatar: "SA", variant: "g4", time: "12:08 PM", preview: "Sounds great — I'll send the Figma file over this afternoon.", unread: true, messages: [
    { from: "them", text: "Hey! Loved your talk at DBS last week. Quick Q about your token architecture — do you scope aliases per-product or share globally?", time: "11:52 AM" },
    { from: "me", text: "Thank you! We tried both. Now we have one global scale and products can only override at the alias level with a lint.", time: "11:59 AM" },
    { from: "them", text: "That would be amazing. Could we do 30 min this week?", time: "12:05 PM" },
    { from: "me", text: "Yep — Thursday at 2pm your time?", time: "12:07 PM" },
    { from: "them", text: "Sounds great — I'll send the Figma file over this afternoon.", time: "12:08 PM" },
  ] },
  { id: 1, name: "Daniel Amrani", role: "Head of Brand · Pylon", avatar: "DA", variant: "g2", time: "10:42 AM", preview: "Totally — let me know when the deck is ready.", unread: true, messages: [{ from: "them", text: "Totally — let me know when the deck is ready and I'll review.", time: "10:42 AM" }] },
  { id: 2, name: "Priya Ravi", role: "Design Engineer · Atlas", avatar: "PR", variant: "g5", time: "Yesterday", preview: "You: Congrats on the launch 🎉", unread: false, messages: [{ from: "me", text: "Thanks! Congrats on the launch btw 🎉", time: "Yesterday 4:12 PM" }] },
  { id: 3, name: "Helix Recruiting", role: "Company page", avatar: "HX", variant: "g2", time: "Yesterday", preview: "We just opened a Staff role — interested?", unread: false, messages: [{ from: "them", text: "We just opened a Staff role on the platform team — interested?", time: "Yesterday 2:03 PM" }] },
];
function MessagesPage() {
  const [selectedId, setSelectedId] = useState(0);
  const [draft, setDraft] = useState("");
  const conv = CONVERSATIONS.find((c) => c.id === selectedId);
  return (
    <Panel style={{ padding: 0, overflow: "hidden", height: "calc(100vh - 150px)" }} bodyStyle={{ padding: 0, height: "100%" }}>
      <div style={{ display: "grid", gridTemplateColumns: "340px 1fr", height: "100%" }}>
        <div style={{ borderRight: "1px solid var(--border-subtle)", display: "flex", flexDirection: "column", minHeight: 0 }}>
          <div style={{ padding: "14px 16px", borderBottom: "1px solid var(--border-subtle)", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16 }}>Messaging</div>
          <div style={{ flex: 1, overflowY: "auto", minHeight: 0 }}>
            {CONVERSATIONS.map((c) => (
              <button key={c.id} type="button" className={`conv-row ${selectedId === c.id ? "active" : ""}`} onClick={() => setSelectedId(c.id)}>
                <Avatar initials={c.avatar} size={48} variant={c.variant} photoSeed={c.role.includes("Company") ? null : c.name} style={c.role.includes("Company") ? { borderRadius: 8 } : undefined} />
                <div style={{ flex: 1, minWidth: 0, textAlign: "left" }}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                    <span style={{ fontFamily: "var(--font-display)", fontWeight: c.unread ? 700 : 600, fontSize: 14, flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.name}</span>
                    <span style={{ fontSize: 11, color: c.unread ? "var(--accent-fg)" : "var(--fg-subtle)" }}>{c.time}</span>
                  </div>
                  <div style={{ fontSize: 12, color: c.unread ? "var(--fg)" : "var(--fg-muted)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.preview}</div>
                </div>
                {c.unread && <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--accent)" }} />}
              </button>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", minHeight: 0 }}>
          <div style={{ padding: "14px 20px", borderBottom: "1px solid var(--border-subtle)", display: "flex", alignItems: "center", gap: 12 }}>
            <Avatar initials={conv.avatar} size={40} variant={conv.variant} photoSeed={conv.role.includes("Company") ? null : conv.name} />
            <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15 }}>{conv.name}</div><div style={{ fontSize: 12, color: "var(--fg-muted)" }}>{conv.role}</div></div>
            {!conv.role.includes("Company") && <StatusBadge status={selectedId === 2 ? "away" : "online"} />}
          </div>
          <div style={{ flex: 1, overflowY: "auto", padding: 20, display: "flex", flexDirection: "column", gap: 10, minHeight: 0 }}>
            {conv.messages.map((m, i) => (<div key={i} className={`msg msg--${m.from}`}><div className="msg__bubble">{m.text}</div><div className="msg__time">{m.time}</div></div>))}
          </div>
          <div style={{ borderTop: "1px solid var(--border-subtle)", padding: 12, display: "flex", gap: 8, alignItems: "flex-end" }}>
            <Textarea size="sm" rows={2} placeholder={`Write a message to ${conv.name.split(" ")[0]}…`} value={draft} onChange={(e) => setDraft(e.target.value)} style={{ flex: 1 }} />
            <Button variant="primary" size="sm" pill iconRight="send" onClick={() => setDraft("")}>Send</Button>
          </div>
        </div>
      </div>
    </Panel>
  );
}

/* ============================ Alerts ============================ */
const ALERTS = [
  { id: 0, type: "mention", unread: true, time: "12m", avatar: "SA", variant: "g4", actor: "Sofia Antonova", title: <><strong>Sofia Antonova</strong> mentioned you in a comment</>, body: '"…following Yara\'s approach on scoped aliases we\'ve cut our token sprawl in half."' },
  { id: 1, type: "reaction", unread: true, time: "1h", avatar: "DA", variant: "g2", actor: "Daniel Amrani", title: <><strong>Daniel Amrani</strong> and <strong>42 others</strong> reacted to your post</>, body: '"A design system is a contract, not a style guide."' },
  { id: 2, type: "job", unread: true, time: "3h", avatar: "HX", variant: "g2", isCompany: true, title: <>A new job matches your preferences: <strong>Staff Product Designer</strong> at Helix</>, body: "Lisbon or Remote · €110k – €140k · Matches 8 of 10 skills" },
  { id: 3, type: "connection", unread: false, time: "6h", avatar: "PR", variant: "g5", actor: "Priya Ravi", title: <><strong>Priya Ravi</strong> accepted your connection request</>, body: "You have 12 mutual connections, including Miriam Chen." },
  { id: 4, type: "anniversary", unread: false, time: "2d", avatar: "MC", variant: "g4", actor: "Miriam Chen", title: <><strong>Miriam Chen</strong> is celebrating 5 years at Helix Systems</>, body: "Say congrats to keep in touch." },
];
const ALERT_ICON_MAP = {
  mention: { icon: "chat_bubble", color: "var(--accent-fg)" }, reaction: { icon: "favorite", color: "var(--danger-fg)" },
  job: { icon: "work", color: "var(--success-fg)" }, connection: { icon: "group", color: "var(--accent-fg)" },
  anniversary: { icon: "favorite", color: "var(--alt-fg)" },
};
function AlertRow({ alert, compact }) {
  const ico = ALERT_ICON_MAP[alert.type] || { icon: "notifications", color: "var(--fg-muted)" };
  return (
    <div className={`alert-row ${alert.unread ? "alert-row--unread" : ""} ${compact ? "alert-row--compact" : ""}`}>
      <div style={{ position: "relative", flexShrink: 0 }}>
        <Avatar initials={alert.avatar} size={compact ? 40 : 48} variant={alert.variant} photoSeed={alert.isCompany ? null : alert.actor} style={{ borderRadius: alert.isCompany ? 8 : "50%" }} />
        <span className="alert-row__type-badge" style={{ color: ico.color }}><Icon name={ico.icon} /></span>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: compact ? 13 : 14, lineHeight: 1.45 }}>{alert.title}</div>
        {alert.body && <div style={{ fontSize: compact ? 12 : 13, color: "var(--fg-muted)", marginTop: 4, lineHeight: 1.5 }}>{alert.body}</div>}
        <div className="meta" style={{ marginTop: 6 }}>{alert.time} ago</div>
      </div>
    </div>
  );
}
function AlertsDropdown({ onClose, onViewAll }) {
  const unread = ALERTS.filter((a) => a.unread).length;
  // The positioned frame (border, shadow, radius) is the PopoverContent; this
  // component only owns the internal header / scrolling body / footer layout.
  return (
    <>
      <div className="alerts-dropdown__header">
        <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14 }}>Notifications</span>
        {unread > 0 && <Pill variant="accent">{unread} new</Pill>}
        <Button variant="ghost" size="icon-sm" style={{ marginLeft: "auto" }} icon="close" onClick={onClose} />
      </div>
      <div className="alerts-dropdown__body">{ALERTS.slice(0, 5).map((a) => <AlertRow key={a.id} alert={a} compact />)}</div>
      <div className="alerts-dropdown__footer"><Button variant="ghost" size="sm" style={{ width: "100%" }} onClick={onViewAll}>View all notifications</Button></div>
    </>
  );
}
function AlertsPage() {
  const [tab, setTab] = useState("all");
  const [prefs, setPrefs] = useState({ mentions: true, jobs: true, network: true, searches: false });
  const setPref = (k) => (v) => setPrefs((p) => ({ ...p, [k]: v }));
  const filtered = tab === "all" ? ALERTS : tab === "jobs" ? ALERTS.filter((a) => a.type === "job") : ALERTS.filter((a) => a.type === "mention" || a.type === "reaction");
  return (
    <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 300px", gap: 12, alignItems: "start" }}>
      <main className="flex flex-col gap-3">
        <Panel style={{ padding: "0 8px" }} bodyStyle={{ padding: 0 }}>
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList variant="line" className="w-full justify-start rounded-none">
              <TabsTrigger value="all" className="flex-none px-3.5">All</TabsTrigger>
              <TabsTrigger value="mentions" className="flex-none px-3.5">Mentions</TabsTrigger>
              <TabsTrigger value="jobs" className="flex-none px-3.5">Jobs</TabsTrigger>
            </TabsList>
          </Tabs>
        </Panel>
        <Panel bodyStyle={{ padding: 0 }}>
          {filtered.map((a, i) => (
            <React.Fragment key={a.id}>
              <AlertRow alert={a} />
              {/* Ad has its own border; give it breathing room from the panel
                  frame even though the alert rows above/below are edge-to-edge. */}
              {i === 2 && <div style={{ padding: "12px 16px" }}><InlineAd ad={AD_LIBRARY.course} /></div>}
            </React.Fragment>
          ))}
        </Panel>
      </main>
      <aside className="flex flex-col gap-3">
        <Panel title="Notification settings">
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <SettingRow label="Mentions of you" desc="When someone @-mentions you" checked={prefs.mentions} onCheckedChange={setPref("mentions")} />
            <SettingRow label="Job recommendations" desc="Roles that match your profile" checked={prefs.jobs} onCheckedChange={setPref("jobs")} />
            <SettingRow label="Network activity" desc="Posts and milestones" checked={prefs.network} onCheckedChange={setPref("network")} />
            <SettingRow label="Profile searches" desc="When you appear in search" checked={prefs.searches} onCheckedChange={setPref("searches")} />
          </div>
        </Panel>
        <RailAd ad={AD_LIBRARY.aws} />
        <RailFooter />
      </aside>
    </div>
  );
}

/* ============================ Search results ============================ */
/* Pill-shaped Select chip. The "any" option carries the resting label (e.g.
   "Locations") so the chip reads like a filter prompt until something's picked,
   and turns into a filled (active) chip once it is. */
function FilterChip({ label, value, options, onChange }) {
  const active = value !== "any";
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger size="sm" className={`rounded-full px-3 ${active ? "border-transparent bg-[var(--accent-subtle)] text-[var(--accent-fg)]" : ""}`}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>{options.map((o) => <SelectItem key={o} value={o}>{o === "any" ? label : o}</SelectItem>)}</SelectContent>
    </Select>
  );
}
/* A boolean / single-select pill that fills when active. */
function ToggleChip({ active, onClick, children }) {
  return <Button variant={active ? "primary" : "outline"} size="sm" pill onClick={onClick}>{children}</Button>;
}
/* Labeled control group for the All-filters side panel. */
function FilterField({ label, children }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-semibold uppercase tracking-wide text-[var(--fg-subtle)]">{label}</span>
      {children}
    </div>
  );
}
/* The category selector — a filled pill that opens the full category list. */
function CategoryMenu({ category, onCategoryChange }) {
  const cat = SEARCH_CATEGORIES.find((c) => c.id === category) || SEARCH_CATEGORIES[0];
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="primary" size="sm" pill icon={cat.icon} iconRight="expand_more">{cat.label}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-48">
        {SEARCH_CATEGORIES.map((c) => (
          <DropdownMenuItem key={c.id} onClick={() => onCategoryChange(c.id)}>
            <Icon name={c.icon} className="text-[18px] me-1" />{c.label}
            {c.id === category && <Icon name="check" className="text-[18px] ms-auto" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
function ResultRow({ result, query }) {
  const { type } = result;
  const isRound = type === "person";
  const { goToCompany, goToProfile, goToJobs } = React.useContext(NavContext);
  const cid = type === "company" ? companyIdFor(result.title) : null;
  // Whole-row destination by result type.
  const go =
    type === "company" && cid ? () => goToCompany(cid) :
    type === "person" ? () => goToProfile({ name: result.title, role: result.sub, photoSeed: result.title, variant: result.variant }) :
    type === "job" ? () => goToJobs() : null;
  return (
    <Panel style={{ padding: 16, cursor: go ? "pointer" : undefined }} bodyStyle={{ display: "flex", gap: 14, alignItems: "flex-start" }} onClick={go || undefined}>
      <Avatar initials={result.avatar} size={48} variant={result.variant} photoSeed={isRound ? result.title : null} photo={["company", "product", "school", "service", "event"].includes(type) ? brandLogo(result.title) : undefined} bg={COMPANIES[cid]?.logoBg} shape={isRound ? "circle" : "rounded"} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <span style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 15 }}>{highlightMatch(result.title, query)}</span>
          {type === "person" && result.connection && <Pill>{result.connection}</Pill>}
          {type === "job" && <Pill variant="success">Hiring</Pill>}
          <span style={{ marginLeft: "auto" }} className="typeahead__type-chip"><Icon name={TYPE_ICONS[type]} size="sm" />{TYPE_LABELS[type]}</span>
        </div>
        <div style={{ fontSize: 13, color: "var(--fg-muted)", marginTop: 2 }}>{result.sub}</div>
        <div style={{ marginTop: 10, display: "flex", gap: 8 }} onClick={(e) => e.stopPropagation()}>
          {type === "person" && <><Button variant="outline" size="sm" pill icon="add">Connect</Button><Button variant="ghost" size="sm" pill>Message</Button></>}
          {type === "company" && <Button variant="outline" size="sm" pill icon="add">Follow</Button>}
          {type === "job" && <><Button variant="primary" size="sm" pill>Apply</Button><Button variant="ghost" size="sm" pill icon="bookmark">Save</Button></>}
          {type === "group" && <Button variant="outline" size="sm" pill>Join</Button>}
          {type === "post" && <Button variant="ghost" size="sm" pill iconRight="arrow_forward">Read post</Button>}
          {type === "course" && <Button variant="outline" size="sm" pill icon="bookmark">Save</Button>}
          {type === "event" && <Button variant="outline" size="sm" pill icon="check">Attend</Button>}
          {type === "product" && <Button variant="outline" size="sm" pill>View page</Button>}
          {type === "school" && <Button variant="outline" size="sm" pill icon="add">Follow</Button>}
          {type === "service" && <Button variant="outline" size="sm" pill>Request services</Button>}
        </div>
      </div>
    </Panel>
  );
}
/* The curated searches that actually work, as clickable pills. Shown on the
   empty and no-match states so the demo always points at something live. */
function SearchSuggestions({ onRun }) {
  return (
    <div className="mt-4 flex flex-wrap justify-center gap-2">
      {SAVED_SEARCHES.filter((s) => s.category !== "all").map((s) => (
        <Button key={s.label} variant="outline" size="sm" pill icon={SEARCH_CATEGORIES.find((c) => c.id === s.category)?.icon} onClick={() => onRun(s.label, s.category)}>{s.label}</Button>
      ))}
    </div>
  );
}
const DEFAULT_SEARCH_FILTERS = { location: "any", industry: "any", connection: "any", remote: false };
function SearchResults({ query, category = "all", onCategoryChange, onRunSearch }) {
  const [filters, setFilters] = useState(DEFAULT_SEARCH_FILTERS);
  const [sheetOpen, setSheetOpen] = useState(false);
  // A new query or category starts from a clean filter slate.
  useEffect(() => { setFilters(DEFAULT_SEARCH_FILTERS); }, [query, category]);

  const cat = SEARCH_CATEGORIES.find((c) => c.id === category) || SEARCH_CATEGORIES[0];
  // Search is curated: only a saved search returns results. Anything else is a
  // valid page with zero results and a nudge toward the searches that work.
  const valid = !!savedSearchFor(query);
  const base = resultsFor(query);
  const inCat = cat.types ? base.filter((e) => cat.types.includes(e.type)) : base;
  const optsOf = (key) => ["any", ...new Set(inCat.map((e) => e[key]).filter(Boolean))];
  const locations = optsOf("location");
  const industries = optsOf("industry");
  const connections = optsOf("connection");

  const setF = (patch) => setFilters((f) => ({ ...f, ...patch }));
  const filtered = inCat.filter((e) =>
    (filters.location === "any" || e.location === filters.location) &&
    (filters.industry === "any" || e.industry === filters.industry) &&
    (filters.connection === "any" || e.connection === filters.connection) &&
    (!filters.remote || (e.location || "").toLowerCase().includes("remote"))
  );

  // Each category bubbles up only the chips its data supports.
  const showLocation = ["all", "people", "jobs", "companies"].includes(category) && locations.length > 1;
  const showIndustry = ["all", "jobs", "companies"].includes(category) && industries.length > 1;
  const showConnection = category === "people" && connections.length > 1;
  const showRemote = category === "jobs";
  const hasChips = showLocation || showIndustry || showConnection || showRemote;
  const degree = (d) => (d === "3rd" ? "3rd+" : d);

  if (query === "") return (
    <main className="flex min-w-0 flex-col gap-3">
      <Panel style={{ padding: 40 }} bodyStyle={{ textAlign: "center", padding: 40 }}>
        <Icon name="search" className="text-[48px] text-[var(--fg-subtle)]" />
        <h3 style={{ marginTop: 16, fontFamily: "var(--font-display)" }}>Search the Davinci network</h3>
        <p className="meta" style={{ marginTop: 8 }}>Pick one of these searches to explore.</p>
        <SearchSuggestions onRun={onRunSearch} />
      </Panel>
    </main>
  );

  // Off-list query: not one of the curated searches → no results, by design.
  if (!valid) return (
    <main className="flex min-w-0 flex-col gap-3">
      <Panel style={{ padding: 40 }} bodyStyle={{ textAlign: "center", padding: 40 }}>
        <Icon name="search_off" className="text-[48px] text-[var(--fg-subtle)]" />
        <h3 style={{ marginTop: 16, fontFamily: "var(--font-display)" }}>No results for "{query}"</h3>
        <p className="meta" style={{ marginTop: 8 }}>This demo only searches a curated set. Try one of these:</p>
        <SearchSuggestions onRun={onRunSearch} />
      </Panel>
    </main>
  );

  return (
    <main className="flex min-w-0 flex-col gap-3">
      {/* Filter bar: category selector + the chips that category supports +
          All filters. Sticks under the top nav so it stays reachable. */}
      <Panel bare className="sticky top-14 z-20">
        <div className="flex flex-wrap items-center gap-2 p-2.5">
          <CategoryMenu category={category} onCategoryChange={onCategoryChange} />
          {hasChips && <Separator orientation="vertical" className="h-6" />}
          {showConnection && connections.filter((c) => c !== "any").map((d) => (
            <ToggleChip key={d} active={filters.connection === d} onClick={() => setF({ connection: filters.connection === d ? "any" : d })}>{degree(d)}</ToggleChip>
          ))}
          {showRemote && <ToggleChip active={filters.remote} onClick={() => setF({ remote: !filters.remote })}>Remote</ToggleChip>}
          {showLocation && <FilterChip label="Locations" value={filters.location} options={locations} onChange={(v) => setF({ location: v })} />}
          {showIndustry && <FilterChip label="Industry" value={filters.industry} options={industries} onChange={(v) => setF({ industry: v })} />}
          <Button variant="ghost" size="sm" pill icon="tune" onClick={() => setSheetOpen(true)}>All filters</Button>
          <span className="ms-auto shrink-0 text-xs text-[var(--fg-muted)]"><strong style={{ color: "var(--fg)" }}>{filtered.length}</strong> results</span>
        </div>
      </Panel>

      {filtered.length === 0 ? (
        <Panel style={{ padding: 40 }} bodyStyle={{ textAlign: "center", padding: 40 }}>
          <Icon name="search_off" className="text-[48px] text-[var(--fg-subtle)]" />
          <h3 style={{ marginTop: 16, fontFamily: "var(--font-display)" }}>No {category === "all" ? "" : cat.label.toLowerCase() + " "}results for "{query}"</h3>
          <p className="meta" style={{ marginTop: 8 }}>Try another category or clear your filters.</p>
        </Panel>
      ) : filtered.map((r, i) => (
        <React.Fragment key={r.id}>
          <ResultRow result={r} query={query} />
          {(i + 1) % 4 === 0 && i < filtered.length - 1 && <InlineAd ad={AD_LIBRARY.recruit} />}
        </React.Fragment>
      ))}

      {/* The complete filter side panel — every facet, regardless of which chips
          are bubbled into the bar. "All filters" opens it. */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="right" className="w-[340px] sm:max-w-[340px]">
          <SheetHeader>
            <SheetTitle>All filters</SheetTitle>
            <SheetDescription>Refine results across every facet.</SheetDescription>
          </SheetHeader>
          <div className="flex flex-1 flex-col gap-5 overflow-y-auto px-4">
            <FilterField label="Location"><FilterChip label="Any location" value={filters.location} options={locations} onChange={(v) => setF({ location: v })} /></FilterField>
            <FilterField label="Industry"><FilterChip label="Any industry" value={filters.industry} options={industries} onChange={(v) => setF({ industry: v })} /></FilterField>
            <FilterField label="Connections">
              <div className="flex flex-wrap gap-2">
                {connections.length > 1
                  ? connections.filter((c) => c !== "any").map((d) => (
                      <ToggleChip key={d} active={filters.connection === d} onClick={() => setF({ connection: filters.connection === d ? "any" : d })}>{degree(d)}</ToggleChip>
                    ))
                  : <span className="meta">No connection data in this category.</span>}
              </div>
            </FilterField>
            <FilterField label="Workplace"><ToggleChip active={filters.remote} onClick={() => setF({ remote: !filters.remote })}>Remote</ToggleChip></FilterField>
          </div>
          <SheetFooter>
            <Button variant="secondary" size="sm" onClick={() => setFilters(DEFAULT_SEARCH_FILTERS)}>Reset</Button>
            <SheetClose asChild><Button variant="primary" size="sm">Show {filtered.length} results</Button></SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </main>
  );
}

/* ============================ App shell ============================ */
/* ============================ Layout templates ============================ */
/* Consistent column sizing across pages: left rail 225px, right rail 300px,
   main flexes. Rails hide below lg. Pages compose these instead of hand-rolling
   their own grids. */
function PageThreeCol({ left, right, children }) {
  return (
    <div className="grid grid-cols-1 gap-3 lg:grid-cols-[225px_minmax(0,1fr)_300px]">
      <aside className="hidden flex-col gap-3 lg:flex">{left}</aside>
      <main className="flex min-w-0 flex-col gap-3">{children}</main>
      <aside className="hidden flex-col gap-3 lg:flex">{right}</aside>
    </div>
  );
}
function PageTwoColRight({ right, children }) {
  return (
    <div className="grid grid-cols-1 gap-3 lg:grid-cols-[minmax(0,1fr)_300px]">
      <main className="flex min-w-0 flex-col gap-3">{children}</main>
      <aside className="hidden flex-col gap-3 lg:flex">{right}</aside>
    </div>
  );
}
function PageTwoColLeft({ left, children }) {
  return (
    <div className="grid grid-cols-1 gap-3 lg:grid-cols-[225px_minmax(0,1fr)]">
      <aside className="hidden flex-col gap-3 lg:flex">{left}</aside>
      <main className="flex min-w-0 flex-col gap-3">{children}</main>
    </div>
  );
}
function PageSingle({ children, max = 820 }) {
  return <div className="mx-auto flex w-full flex-col gap-3" style={{ maxWidth: max }}>{children}</div>;
}

/* ============================ Ad gallery ============================ */
function AdGallery() {
  const G = ({ children }) => <p style={{ fontSize: 13, color: "var(--fg-muted)", lineHeight: 1.6, margin: "0 0 14px" }}>{children}</p>;
  return (
    <div className="mx-auto flex max-w-[900px] flex-col gap-3">
      <Panel title="Ad formats & placement">
        <p style={{ fontSize: 14, lineHeight: 1.6, margin: 0 }}>
          The demo ships three sponsored-content formats. Each shares the "Promoted" treatment and an advertiser chip so the pattern is recognizable across surfaces — but they differ in footprint and where they belong. Use the lightest format that fits the surface's density.
        </p>
      </Panel>
      <Panel title="Feed Ad — in-stream, full width">
        <G>Placement: inline in the main feed, between posts (about one per three organic posts). Best for rich creative with a single CTA. Avoid stacking two in a row.</G>
        <FeedAd ad={AD_LIBRARY.notion} />
      </Panel>
      <Panel title="Rail Ad — compact sidebar tile">
        <G>Placement: a right or left rail. A creative band + advertiser + one CTA. Good for a persistent, low-friction promo alongside content.</G>
        <div style={{ maxWidth: 300 }}><RailAd ad={AD_LIBRARY.aws} /></div>
      </Panel>
      <Panel title="Inline Ad — thin row between list items">
        <G>Placement: between list rows (jobs, alerts, search results, network suggestions) — about one per four items. The lowest-profile format; never use it where a Feed Ad fits.</G>
        <InlineAd ad={AD_LIBRARY.recruit} />
      </Panel>
    </div>
  );
}

export function App() {
  const [route, setRoute] = useState("home");
  const [companyId, setCompanyId] = useState("davinci");
  const [profilePerson, setProfilePerson] = useState(null);
  const [theme, setTheme] = useState("dark");
  const [alertsOpen, setAlertsOpen] = useState(false);
  const [footerOpen, setFooterOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [searchCategory, setSearchCategory] = useState("all");

  useEffect(() => { document.documentElement.setAttribute("data-theme", theme); }, [theme]);

  const goToCompany = (id) => { setCompanyId(id); setRoute("company"); window.scrollTo({ top: 0 }); };
  // A person object routes to that member's profile; no arg (or the current
  // user) routes to the owner's profile.
  const goToProfile = (person) => {
    setProfilePerson(person && person.name && person.name !== ME_NAME ? person : null);
    setRoute("profile"); window.scrollTo({ top: 0 });
  };
  const navValue = {
    goToCompany,
    openFooter: () => setFooterOpen(true),
    goToProfile,
    goToJobs: () => { setRoute("jobs"); window.scrollTo({ top: 0 }); },
  };

  // `profile` is reached from the Me menu, not a nav tab — leave the nav in its
  // default (nothing-active) state so Home reads as a place to return to.
  const activeTab = { home: "home", profile: "", company: "", network: "network", jobs: "jobs", messaging: "messaging", notifications: "notifications", search: "", ads: "" }[route] ?? "home";

  // A submit may carry an explicit category (chosen suggestion); otherwise we
  // resolve it from the matching saved search. Unknown queries still route to
  // the search page, which renders the "no curated results" state.
  const onSearchSubmit = (q, category) => {
    setSubmittedQuery(q); setSearchValue(q);
    setSearchCategory(category || savedSearchFor(q)?.category || "all");
    setRoute("search");
  };

  const pages = {
    home: <PageThreeCol left={<LeftRail onViewProfile={() => goToProfile()} />} right={<RightRail />}><Feed /></PageThreeCol>,
    profile: profilePerson ? <OtherProfile person={profilePerson} /> : <ProfilePage />,
    company: <CompanyPage companyId={companyId} goToCompany={goToCompany} />,
    network: <NetworkPage />,
    jobs: <JobsPage />,
    messaging: <MessagesPage />,
    notifications: <AlertsPage />,
    search: <PageSingle max={820}><SearchResults query={submittedQuery} category={searchCategory} onCategoryChange={setSearchCategory} onRunSearch={onSearchSubmit} /></PageSingle>,
    ads: <AdGallery />,
  };

  const jump = [["home", "Feed"], ["profile", "Profile"], ["company", "Company"], ["network", "Network"], ["jobs", "Jobs"], ["messaging", "Messages"], ["notifications", "Alerts"], ["ads", "Ad gallery"]];

  return (
    <NavContext.Provider value={navValue}>
    <TooltipProvider delayDuration={300}>
    <Surface variant="canvas" className="min-h-screen">
      <TopNav
        active={activeTab} onNavigate={setRoute}
        searchValue={searchValue}
        onSearchChange={(v) => { setSearchValue(v); if (route === "search") setSubmittedQuery(v); }}
        onSearchSubmit={onSearchSubmit}
        alertCount={3} alertsOpen={alertsOpen} onToggleAlerts={setAlertsOpen}
      />
      <div className="flex items-center gap-2 overflow-x-auto border-b border-[var(--border-subtle)] bg-[var(--bg-subtle)] px-4" style={{ height: 48 }}>
        <span className="meta shrink-0 me-1">Jump to:</span>
        {jump.map(([id, label]) => (
          <Button key={id} size="sm" pill variant={route === id ? "primary" : "secondary"} onClick={() => setRoute(id)}>{label}</Button>
        ))}
        <div className="ms-auto flex shrink-0 items-center gap-2 ps-4">
          <span className="meta">Theme</span>
          <Tip label={theme === "dark" ? "Switch to light" : "Switch to dark"}>
            <Button variant="ghost" size="sm" icon={theme === "dark" ? "light_mode" : "dark_mode"} onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))} aria-label="Toggle theme" />
          </Tip>
        </div>
      </div>
      <div className="mx-auto max-w-[1180px] px-4 py-5">{pages[route] || pages.home}</div>
    </Surface>
    {footerOpen && <SiteFooter onClose={() => setFooterOpen(false)} />}
    </TooltipProvider>
    </NavContext.Provider>
  );
}
