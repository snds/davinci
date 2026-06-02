import * as React from "react";

import { Badge } from "@davinci/ui/components/ui/badge";

/* StatusBadge — a status with a leading colored dot (online / hiring / away /
 * closed / new). Uses the outline Badge so the dot carries the semantic color
 * rather than flooding the whole chip. Pass children to override the label.
 */
const STATUS_TONE = {
  online: { dot: "var(--success)", label: "Online" },
  hiring: { dot: "var(--success)", label: "Actively hiring" },
  away: { dot: "var(--warning)", label: "Away" },
  closed: { dot: "var(--fg-subtle)", label: "Closed" },
  new: { dot: "var(--accent)", label: "New" },
};

function StatusBadge({ status = "online", children }) {
  const t = STATUS_TONE[status] || STATUS_TONE.online;
  return (
    <Badge variant="outline" className="rounded-full gap-1.5" style={{ borderColor: "var(--border-subtle)", color: "var(--fg-muted)" }}>
      <span style={{ width: 7, height: 7, borderRadius: "50%", background: t.dot, flexShrink: 0 }} />
      {children || t.label}
    </Badge>
  );
}

export { StatusBadge, STATUS_TONE };
