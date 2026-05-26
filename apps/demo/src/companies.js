// Company-page data. Each company shares the same shape; tabs render from it.
// People/Insights use shared generics to keep authoring tractable for the demo.

export const GENERIC = {
  events: [
    { title: "Annual Product Summit 2026", date: "Mar 18, 2026", attendees: 412 },
    { title: "Design Systems Live: AMA", date: "Jan 22, 2026", attendees: 188 },
    { title: "State of the Industry webinar", date: "Nov 5, 2025", attendees: 1240 },
  ],
  people: {
    live: [["United States", 813], ["California", 393], ["Greater Lisbon", 249], ["India", 158], ["Berlin", 120]],
    studied: [["Cal Poly", 60], ["Carnegie Mellon", 41], ["Royal College of Art", 28], ["TU Delft", 22]],
    pymk: [
      { name: "Sarah LeCroy", role: "Product Design", seed: "sarah lecroy", conn: "2nd" },
      { name: "Paul Twohey", role: "Engineering Leader", seed: "paul twohey", conn: "2nd" },
      { name: "Kristen Buck", role: "Lead Instructional Designer", seed: "kristen buck", conn: "2nd" },
      { name: "Taylor Tran", role: "Design", seed: "taylor tran", conn: "3rd" },
      { name: "Jeff Novich", role: "Principal PM", seed: "jeff novich", conn: "2nd" },
      { name: "Jessica Paolini", role: "Talent Acquisition Leader", seed: "jessica paolini", conn: "2nd" },
    ],
  },
  insights: {
    hiringBlurb:
      "Expanding sales and operations: the Sales and Operations teams have grown 8% and 10% respectively over the last six months, suggesting investment in market reach and operational capacity.",
    newHires: 102,
    growth: "+25%",
    tenure: "4.1 years",
    functions: [["Engineering", "+9%"], ["Sales", "+7%"], ["Product", "+17%"], ["Operations", "+12%"]],
    alumni: [
      { name: "Tom Aveston", role: "CFO at Playlist", was: "Prev. CFO", seed: "tom aveston" },
      { name: "Eva Lauer", role: "VP, Strategic Accounts", was: "Prev. VP", seed: "eva lauer" },
      { name: "Kristin Heintz", role: "SVP, International", was: "Prev. SVP, Finance", seed: "kristin heintz" },
    ],
    focus: [
      "Investing in AI-assisted workflows to reduce manual work across the product.",
      "Expanding into adjacent markets through partnerships and acquisitions.",
    ],
  },
  rail: {
    affiliated: [["Playlist", "Technology, Information and Internet"]],
    alsoUse: [["Xplor Gym", "Fitness Club Management"], ["Xplor Mariana Tek", "Fitness Club Management"], ["Playtomic App", "Fitness Club Management"]],
    alsoViewed: [["ClassPass", "Consumer Services"], ["Headspace", "Mental Health Care"], ["Lovable", "Software Development"]],
    alsoFollow: [["OpenAI", "Research Services"], ["ChatGPT", "Technology, Information and Internet"]],
  },
  // Filler used to pad every company to a consistent, "lived-in" density.
  fillerPosts: [
    { body: "We're growing the team — check out our open roles and help us build what's next. 🚀", reactions: 142, comments: 8 },
    { body: "Behind the scenes: how we think about shipping quality at speed. New on the blog.", attachment: { title: "How we ship — our engineering principles", sub: "Blog · 6 min read", image: "article-ship" }, reactions: 326, comments: 21 },
    { body: "Proud to share our latest customer story — real teams, real outcomes. Thank you for building with us. 💚", reactions: 211, comments: 13 },
    { body: "ICYMI: replays from last month's community event are live. Three talks you shouldn't miss.", attachment: { title: "Community event — talk replays", sub: "youtube.com · Watch now", image: "article-event" }, reactions: 188, comments: 9 },
  ],
  fillerJobs: [
    ["Software Engineer", "Remote · EU", "1 week ago"],
    ["Product Marketing Manager", "Hybrid", "2 weeks ago"],
    ["Customer Success Lead", "Remote", "3 days ago"],
    ["Data Analyst", "Remote · EU", "5 days ago"],
  ],
  pymk: [
    { name: "Sarah LeCroy", role: "Product Design", seed: "sarah lecroy" },
    { name: "Paul Twohey", role: "Engineering Leader", seed: "paul twohey" },
    { name: "Kristen Buck", role: "Lead Instructional Designer", seed: "kristen buck" },
    { name: "Jeff Novich", role: "Principal Product Manager", seed: "jeff novich" },
  ],
};

export const COMPANIES = {
  davinci: {
    id: "davinci", name: "Davinci Systems", initials: "D", logoBg: "var(--blue-9)", verified: true,
    tagline: "Design infrastructure for product teams.",
    industry: "Software Development", location: "Lisbon, Portugal", followers: "24,802", size: "201–500 employees", founded: "2018", website: "davinci-systems.com",
    coverSeed: "davinci-systems-banner", coverKind: "office",
    specialties: ["design systems", "design tokens", "governance", "Figma tooling", "component libraries", "theming", "accessibility", "documentation"],
    about: "Davinci Systems builds the design infrastructure behind some of the largest product organizations in Europe. Our token pipeline, component library, and governance tooling power teams shipping to millions of users daily.",
    product: { name: "Davinci Platform", desc: "Revenue-grade design-system tooling — tokens, components, docs, and Figma sync in one place. With Davinci, your design system is a product, not a folder.", pricing: [["Starter", "$0", "Open-source tokens + docs"], ["Team", "$49", "Figma sync, governance, lint"], ["Enterprise", "Custom", "SSO, SLAs, dedicated support"]], features: ["Token Pipeline", "Figma Sync", "Governance Lint", "Theming Engine"] },
    competitors: [["Tokens Studio", "Design Tools"], ["Specify", "Design Ops"], ["Supernova", "Design Systems"]],
    posts: [
      { id: "dv-p1", time: "1mo", body: "Davinci 3.0 is here — a full rewrite of our token pipeline with native Radix Colors, zero-config theming, and 10× faster Figma sync.", attachment: { title: "Introducing Davinci 3.0", sub: "davinci-systems.com · 4 min read", image: "article-davinci-3" }, reactions: 1204, comments: 96 },
      { id: "dv-p2", time: "3mo", body: "We ranked the design systems that age well. Spoiler: the ones that ship governance, not just components.", reactions: 482, comments: 34 },
    ],
    jobs: [["Senior Design Engineer", "Remote · EU", "5 days ago"], ["Brand Designer", "Lisbon · Hybrid", "1 week ago"], ["Engineering Manager, Tokens", "Remote · EU", "2 weeks ago"]],
    employees: "1,442",
  },
  helix: {
    id: "helix", name: "Helix Systems", initials: "HX", logoBg: "var(--teal-9)", verified: true,
    tagline: "The product & design platform for teams that ship.",
    industry: "Software Development", location: "Lisbon, Portugal", followers: "24,802", size: "501–1,000 employees", founded: "2014", website: "helix.systems",
    coverSeed: "helix-banner", coverKind: "office",
    specialties: ["product platform", "design ops", "dashboards", "component libraries", "developer tools", "analytics"],
    about: "Helix Systems powers product and design teams with a unified platform — from dashboards to design ops. Used by thousands of teams to move faster without losing craft.",
    product: { name: "Helix Platform", desc: "One platform for product, design, and engineering to plan, build, and measure together.", pricing: [["Starter", "$0", "Up to 5 editors"], ["Pro", "$29", "Unlimited projects + analytics"], ["Scale", "Custom", "Enterprise governance"]], features: ["Dashboards", "Design Ops", "Analytics", "Real-time Collab"] },
    competitors: [["Vector Project OS", "Developer Tools"], ["Atlas Docs", "Knowledge Tools"], ["Frame Design Tools", "Design"]],
    posts: [
      { id: "hx-p1", time: "2w", body: "We're hiring a Design Engineer to work on our token pipeline. Lisbon or fully remote — come define the next chapter of our platform.", attachment: { title: "Design Engineer · Helix Platform Team", sub: "Remote / Lisbon · Apply now", image: "article-helix-hiring" }, reactions: 188, comments: 12 },
      { id: "hx-p2", time: "1mo", body: "Helix dashboards just got real-time cursors. Watch your whole team think in the same canvas.", reactions: 642, comments: 41 },
    ],
    jobs: [["Staff Product Designer", "Lisbon or Remote · EU", "5 days ago"], ["Senior Frontend Engineer", "Remote · EU", "3 days ago"], ["Design Ops Lead", "Lisbon · Hybrid", "1 week ago"]],
    employees: "842",
  },
  atlas: {
    id: "atlas", name: "Atlas Docs", initials: "AT", logoBg: "var(--amber-9)", verified: true,
    tagline: "Your team's knowledge — that actually stays up to date.",
    industry: "Software Development", location: "New York, NY", followers: "214,882", size: "1,001–5,000 employees", founded: "2016", website: "atlasdocs.com",
    coverSeed: "atlas-banner", coverKind: "office",
    specialties: ["knowledge management", "AI docs", "wikis", "collaboration", "search", "enterprise"],
    about: "Atlas Docs is the AI-native knowledge base. It rewrites stale docs in place, flags conflicts, and learns your team's voice — so your wiki is actually true.",
    product: { name: "Atlas", desc: "Docs, wikis, and projects together — with an AI that keeps everything current.", pricing: [["Free", "$0", "Teams under 10"], ["Team", "$12", "AI rewrites + search"], ["Enterprise", "Custom", "SSO, audit, residency"]], features: ["AI Rewrite", "Conflict Detection", "Universal Search", "Voice Matching"] },
    competitors: [["Notion", "Productivity"], ["Confluence", "Collaboration"], ["Slab", "Knowledge"]],
    posts: [
      { id: "at-p1", time: "1w", body: "Atlas AI now rewrites stale docs in place — and tells you why it changed them. Knowledge that maintains itself.", attachment: { title: "Docs that write themselves", sub: "atlasdocs.com · Product update", image: "article-atlas-ai" }, reactions: 902, comments: 73 },
      { id: "at-p2", time: "2mo", body: "We studied 4,000 team wikis. The median doc is 14 months stale. Here's what we're doing about it.", reactions: 511, comments: 38 },
    ],
    jobs: [["Senior Design Engineer", "Remote · Americas", "2 days ago"], ["ML Engineer, Search", "Remote", "4 days ago"], ["Product Manager, Editor", "New York · Hybrid", "1 week ago"]],
    employees: "2,310",
  },
  pulse: {
    id: "pulse", name: "Pulse Meetings", initials: "PU", logoBg: "var(--blue-9)", verified: true,
    tagline: "Smarter meetings, fewer of them.",
    industry: "Software Development", location: "Remote", followers: "84,320", size: "201–500 employees", founded: "2019", website: "pulse.co",
    coverSeed: "pulse-banner", coverKind: "office",
    specialties: ["meetings", "AI co-host", "transcription", "scheduling", "productivity"],
    about: "Pulse is an AI co-host for every call. It drafts the agenda, transcribes, and files action items before you close the tab — so teams meet less and decide more.",
    product: { name: "Pulse", desc: "An AI co-host that runs your meetings: agenda, notes, and action items, automatically.", pricing: [["Free", "$0", "Teams under 20"], ["Pro", "$15", "AI notes + action items"], ["Business", "Custom", "Admin + integrations"]], features: ["AI Agenda", "Live Transcription", "Action Items", "Calendar Sync"] },
    competitors: [["Otter", "Productivity"], ["Fathom", "Meetings"], ["Granola", "Notes"]],
    posts: [
      { id: "pu-p1", time: "3w", body: "Teams using Pulse cut meeting time by 30% in the first month. Fewer meetings, better decisions.", attachment: { title: "Cut your meetings by 30%", sub: "pulse.co · Customer study", image: "article-pulse" }, reactions: 388, comments: 22 },
    ],
    jobs: [["Staff Brand Designer", "New York · Hybrid", "3 days ago"], ["Backend Engineer, AI", "Remote", "5 days ago"]],
    employees: "318",
  },
  vector: {
    id: "vector", name: "Vector Project OS", initials: "VE", logoBg: "var(--violet-9)", verified: true,
    tagline: "Issue tracking built for teams who ship.",
    industry: "Developer Tools", location: "Amsterdam, NL", followers: "42,112", size: "51–200 employees", founded: "2020", website: "vector.dev",
    coverSeed: "vector-banner", coverKind: "office",
    specialties: ["issue tracking", "project management", "developer tools", "keyboard-first", "roadmaps"],
    about: "Vector is the project OS for engineering teams — keyboard-first, instant search, and zero bloat. Built for the teams who'd rather ship than configure.",
    product: { name: "Vector", desc: "Issue tracking and roadmaps that feel instant. Keyboard-first, opinionated, fast.", pricing: [["Free", "$0", "Up to 10 members"], ["Standard", "$8", "Unlimited + integrations"], ["Plus", "$14", "Advanced roadmaps"]], features: ["Instant Search", "Keyboard-first", "Roadmaps", "GitHub Sync"] },
    competitors: [["Linear", "Developer Tools"], ["Jira", "Project Management"], ["Height", "Project Management"]],
    posts: [
      { id: "ve-p1", time: "5d", body: "\"Vector replaced four tools for us.\" Read how engineering teams consolidate their stack.", attachment: { title: "Why engineers prefer Vector", sub: "vector.dev · Case study", image: "article-vector" }, reactions: 274, comments: 19 },
    ],
    jobs: [["Design Systems Lead", "Amsterdam · Hybrid", "1 week ago"], ["Senior Product Engineer", "Remote · EU", "4 days ago"]],
    employees: "164",
  },
  frame: {
    id: "frame", name: "Frame Design Tools", initials: "FR", logoBg: "var(--tomato-9)", verified: true,
    tagline: "Design, prototype, and spec — together.",
    industry: "Software Development", location: "San Francisco, CA", followers: "1.2M", size: "1,001–5,000 employees", founded: "2012", website: "frame.design",
    coverSeed: "frame-banner", coverKind: "office",
    specialties: ["design tool", "prototyping", "vector editing", "collaboration", "specs", "AI design"],
    about: "Frame is the collaborative canvas where teams design, prototype, and spec together. Used by millions of designers to think and build in the same place.",
    product: { name: "Frame", desc: "Real-time cursors, vector networks, and AI-assisted specs — all in one collaborative canvas.", pricing: [["Starter", "$0", "Up to 5 editors"], ["Pro", "$18", "Unlimited files + specs"], ["Org", "Custom", "SSO + design systems"]], features: ["Vector Networks", "Real-time Cursors", "AI Specs", "Dev Mode"] },
    competitors: [["Sketch", "Design"], ["Penpot", "Design"], ["Framer", "Design"]],
    posts: [
      { id: "fr-p1", time: "2w", body: "Frame 2026 is here. Real-time cursors, vector networks, and AI-assisted specs in one canvas.", attachment: { title: "Try Frame 2026 free", sub: "frame.design · Launch", image: "article-frame" }, reactions: 2104, comments: 142 },
    ],
    jobs: [["Principal Product Designer", "San Francisco · Onsite", "4 days ago"], ["Staff Engineer, Canvas", "Remote · Americas", "1 week ago"]],
    employees: "3,180",
  },
};

// Map a display name (any case) to a company id, for cross-app navigation.
export const COMPANY_ALIAS = Object.fromEntries(
  Object.values(COMPANIES).map((c) => [c.name.toLowerCase(), c.id])
);
export function companyIdFor(name) {
  return COMPANY_ALIAS[String(name || "").toLowerCase()] || null;
}
