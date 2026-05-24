import * as React from "react";

import { Surface } from "@davinci/ui/components/ui/surface";
import { Button } from "@davinci/ui/components/ui/button";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@davinci/ui/components/ui/avatar";
import { Badge } from "@davinci/ui/components/ui/badge";
import { Input } from "@davinci/ui/components/ui/input";
import { Separator } from "@davinci/ui/components/ui/separator";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@davinci/ui/components/ui/card";
import { RichTextarea } from "@davinci/ui/components/ui/rich-textarea";

/* Material Symbols Rounded (font loaded in index.html; class in colors_and_type.css) */
function Icon({ name, className = "", style }) {
  return (
    <span className={`material-symbols-rounded ${className}`} style={style} aria-hidden>
      {name}
    </span>
  );
}

function photo(seed) {
  // Deterministic placeholder portrait.
  const ids = [
    "1531123897727-8f129e1688ce",
    "1544005313-94ddf0286df2",
    "1507003211169-0a1dd7228f2d",
    "1500648767791-00dcc994a43e",
    "1438761681033-6461ffad8d80",
  ];
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = ((h << 5) - h + seed.charCodeAt(i)) | 0;
  const id = ids[Math.abs(h) % ids.length];
  return `https://images.unsplash.com/photo-${id}?w=96&h=96&fit=crop&crop=faces&auto=format&q=75`;
}

function TopBar({ theme, onToggleTheme }) {
  const navItems = [
    { icon: "home", label: "Home", active: true },
    { icon: "group", label: "Network" },
    { icon: "work", label: "Jobs" },
    { icon: "chat_bubble", label: "Messages" },
    { icon: "notifications", label: "Alerts" },
  ];
  return (
    <header className="sticky top-0 z-20 border-b border-[var(--border)] bg-[var(--bg-surface)]/95 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-[1128px] items-center gap-3 px-4">
        <span className="text-xl font-extrabold tracking-tight text-[var(--accent-fg)]">davinci</span>
        <div className="relative ml-1 hidden w-64 items-center sm:flex">
          <Icon name="search" className="pointer-events-none absolute left-2.5 text-[18px] text-[var(--fg-subtle)]" />
          <Input size="sm" placeholder="Search" className="ps-9" aria-label="Search" />
        </div>
        <nav className="ml-auto flex items-center gap-1">
          {navItems.map((n) => (
            <button
              key={n.label}
              className="flex w-16 flex-col items-center gap-0.5 rounded-md py-1 text-[11px] text-[var(--fg-muted)] transition-colors hover:bg-[var(--bg-hover)] data-[active=true]:text-[var(--fg)]"
              data-active={n.active || undefined}
            >
              <Icon name={n.icon} className="text-[22px]" />
              {n.label}
            </button>
          ))}
          <Separator orientation="vertical" className="mx-1 h-8" />
          <Button
            variant="ghost"
            size="icon"
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            onClick={onToggleTheme}
          >
            <Icon name={theme === "dark" ? "light_mode" : "dark_mode"} className="text-[20px]" />
          </Button>
          <Avatar className="ml-1 size-8">
            <AvatarImage src={photo("yara okonkwo")} alt="" />
            <AvatarFallback>YO</AvatarFallback>
          </Avatar>
        </nav>
      </div>
    </header>
  );
}

function LeftRail() {
  return (
    <aside className="hidden flex-col gap-4 lg:flex">
      <Card className="gap-0 overflow-hidden py-0">
        <div className="h-14 bg-[linear-gradient(135deg,var(--blue-7),var(--blue-10))]" />
        <div className="-mt-7 flex flex-col items-center px-4 pb-4 text-center">
          <Avatar className="size-16 ring-3 ring-[var(--bg-surface)]">
            <AvatarImage src={photo("yara okonkwo")} alt="" />
            <AvatarFallback>YO</AvatarFallback>
          </Avatar>
          <div className="mt-2 font-semibold">Yara Okonkwo</div>
          <div className="text-xs text-[var(--fg-muted)]">Design Systems Lead</div>
        </div>
        <Separator />
        <div className="flex items-center justify-between px-4 py-2 text-xs">
          <span className="text-[var(--fg-muted)]">Profile viewers</span>
          <span className="font-semibold text-[var(--accent-fg)]">214</span>
        </div>
        <div className="flex items-center justify-between px-4 pb-3 text-xs">
          <span className="text-[var(--fg-muted)]">Post impressions</span>
          <span className="font-semibold text-[var(--accent-fg)]">1,892</span>
        </div>
      </Card>
    </aside>
  );
}

function Composer() {
  const [open, setOpen] = React.useState(false);
  return (
    <Card>
      <CardContent className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <Avatar className="size-12">
            <AvatarImage src={photo("yara okonkwo")} alt="" />
            <AvatarFallback>YO</AvatarFallback>
          </Avatar>
          {!open && (
            <button
              onClick={() => setOpen(true)}
              className="h-12 flex-1 rounded-full border border-[var(--border)] bg-[var(--bg-surface)] px-4 text-left text-sm text-[var(--fg-muted)] transition-colors hover:bg-[var(--bg-hover)]"
            >
              Share an update, Yara…
            </button>
          )}
        </div>
        {open && (
          <>
            <RichTextarea placeholder="What do you want to talk about?" />
            <div className="flex items-center justify-between">
              <div className="flex gap-1 text-[var(--fg-muted)]">
                <Button variant="ghost" size="icon" aria-label="Photo"><Icon name="image" className="text-[20px]" /></Button>
                <Button variant="ghost" size="icon" aria-label="Video"><Icon name="play_circle" className="text-[20px]" /></Button>
                <Button variant="ghost" size="icon" aria-label="Event"><Icon name="event" className="text-[20px]" /></Button>
              </div>
              <div className="flex gap-2">
                <Button variant="secondary" size="sm" onClick={() => setOpen(false)}>Cancel</Button>
                <Button size="sm">Post</Button>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

function Post({ author, role, time, seed, company, body, reactions, comments, promoted }) {
  const [liked, setLiked] = React.useState(false);
  return (
    <Card>
      <CardHeader className="gap-0">
        <div className="flex items-start gap-3">
          <Avatar className={company ? "size-12 rounded-md" : "size-12"}>
            {!company && <AvatarImage src={photo(seed)} alt="" />}
            <AvatarFallback className={company ? "rounded-md" : ""}>{author.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold">{author}</span>
              {promoted && <Badge variant="secondary" className="text-[10px]">Promoted</Badge>}
            </div>
            <div className="truncate text-xs text-[var(--fg-muted)]">{role}</div>
            <div className="flex items-center gap-1 text-xs text-[var(--fg-subtle)]">
              {time} · <Icon name="public" className="text-[12px]" />
            </div>
          </div>
          <Button variant="ghost" size="icon" aria-label="More"><Icon name="more_horiz" className="text-[20px]" /></Button>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm leading-normal whitespace-pre-line">{body}</p>
      </CardContent>
      <CardContent className="pt-0">
        <div className="flex items-center justify-between pb-2 text-xs text-[var(--fg-muted)]">
          <span><span className="text-[var(--accent-fg)]">❤ 👍 💡</span> {reactions}</span>
          <span>{comments} comments</span>
        </div>
        <Separator />
        <div className="flex justify-around pt-1">
          <Button variant="ghost" size="sm" data-active={liked || undefined} onClick={() => setLiked((v) => !v)}
            className="gap-1.5 data-[active=true]:text-[var(--accent-fg)]">
            <Icon name="thumb_up" className="text-[18px]" /> Like
          </Button>
          <Button variant="ghost" size="sm" className="gap-1.5"><Icon name="chat_bubble" className="text-[18px]" /> Comment</Button>
          <Button variant="ghost" size="sm" className="gap-1.5"><Icon name="repeat" className="text-[18px]" /> Repost</Button>
          <Button variant="ghost" size="sm" className="gap-1.5"><Icon name="send" className="text-[18px]" /> Send</Button>
        </div>
      </CardContent>
    </Card>
  );
}

function RightRail() {
  const people = [
    { name: "Helix Systems", role: "Product & Design Platform", seed: "helix", company: true },
    { name: "Priya Ravi", role: "Principal PM at Pylon", seed: "priya ravi" },
    { name: "Kai Thornton", role: "Design Engineer", seed: "kai thornton" },
  ];
  return (
    <aside className="hidden flex-col gap-4 lg:flex">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Add to your feed</CardTitle>
          <CardDescription className="text-xs">Suggestions based on your activity</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {people.map((p) => (
            <div key={p.name} className="flex items-center gap-2">
              <Avatar className={p.company ? "size-10 rounded-md" : "size-10"}>
                {!p.company && <AvatarImage src={photo(p.seed)} alt="" />}
                <AvatarFallback className={p.company ? "rounded-md" : ""}>{p.name.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium">{p.name}</div>
                <div className="truncate text-xs text-[var(--fg-muted)]">{p.role}</div>
              </div>
              <Button variant="secondary" size="xs">+ Follow</Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </aside>
  );
}

export function App() {
  const [theme, setTheme] = React.useState("dark");
  React.useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <Surface variant="canvas" className="min-h-screen">
      <TopBar theme={theme} onToggleTheme={() => setTheme((t) => (t === "dark" ? "light" : "dark"))} />
      <div className="mx-auto grid max-w-[1128px] grid-cols-1 gap-6 px-4 py-6 lg:grid-cols-[225px_minmax(0,1fr)_300px]">
        <LeftRail />
        <main className="flex flex-col gap-4">
          <Composer />
          <Post
            author="Sofia Antonova"
            role="Staff Designer at Helix · 2nd"
            time="2h"
            seed="sofia antonova"
            body={"Shipping a refresh of our component library today. Fewer tokens, warmer neutrals, and — finally — a proper focus ring on every interactive surface."}
            reactions={482}
            comments={34}
          />
          <Post
            author="Notion"
            role="Sponsored"
            time=""
            seed="notion"
            company
            promoted
            body={"Your team's wiki, docs, and projects — together. Try Notion free for teams of any size."}
            reactions={188}
            comments={12}
          />
          <Post
            author="Daniel Amrani"
            role="Head of Brand at Pylon · 1st"
            time="1d"
            seed="daniel amrani"
            body={"Hot take: most “design systems” are asset libraries with a sitemap. A real system teaches you how to decide — what to build, what to reuse, what to leave alone."}
            reactions={1204}
            comments={96}
          />
        </main>
        <RightRail />
      </div>
    </Surface>
  );
}
