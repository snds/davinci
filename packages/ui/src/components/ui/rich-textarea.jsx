"use client"

import * as React from "react"
import {
  Bold,
  Italic,
  Underline,
  Heading1,
  Heading2,
  List,
  ListOrdered,
  Link as LinkIcon,
  Undo2,
  Redo2,
} from "lucide-react"
import {
  $getSelection,
  $isRangeSelection,
  $createParagraphNode,
  FORMAT_TEXT_COMMAND,
  UNDO_COMMAND,
  REDO_COMMAND,
  CAN_UNDO_COMMAND,
  CAN_REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  COMMAND_PRIORITY_CRITICAL,
} from "lexical"
import {
  HeadingNode,
  QuoteNode,
  $createHeadingNode,
  $isHeadingNode,
} from "@lexical/rich-text"
import {
  ListNode,
  ListItemNode,
  $isListNode,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  REMOVE_LIST_COMMAND,
} from "@lexical/list"
import { LinkNode, TOGGLE_LINK_COMMAND } from "@lexical/link"
import { $setBlocksType } from "@lexical/selection"
import { $getNearestNodeOfType, mergeRegister } from "@lexical/utils"
import { LexicalComposer } from "@lexical/react/LexicalComposer"
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin"
import { ContentEditable } from "@lexical/react/LexicalContentEditable"
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary"
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin"
import { ListPlugin } from "@lexical/react/LexicalListPlugin"
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin"
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin"
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"

import { cn } from "@davinci/ui/lib/utils"

// Map Lexical nodes to token-driven classes so the rendered content matches the system.
const editorTheme = {
  paragraph: "mb-2 last:mb-0",
  heading: {
    h1: "text-xl font-semibold mb-2",
    h2: "text-lg font-semibold mb-2",
  },
  quote: "border-l-2 border-[var(--border)] ps-3 my-2 text-[var(--fg-muted)]",
  list: {
    ul: "list-disc ms-5 mb-2",
    ol: "list-decimal ms-5 mb-2",
    listitem: "mb-1",
    nested: { listitem: "list-none" },
  },
  link: "text-[var(--accent-fg)] underline underline-offset-2",
  text: {
    bold: "font-semibold",
    italic: "italic",
    underline: "underline underline-offset-2",
  },
}

function ToolbarButton({ active, label, onClick, disabled, children }) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={active}
      title={label}
      disabled={disabled}
      data-active={active || undefined}
      onMouseDown={(e) => e.preventDefault()} // keep editor selection
      onClick={onClick}
      className={cn(
        "inline-flex size-8 items-center justify-center rounded-md text-[var(--fg-muted)] outline-none transition-colors",
        "hover:bg-[var(--bg-hover)] hover:text-[var(--fg)]",
        "focus-visible:ring-2 focus-visible:ring-ring/50",
        "disabled:pointer-events-none disabled:opacity-40",
        "data-[active=true]:bg-[var(--accent-subtle)] data-[active=true]:text-[var(--accent-fg)]",
        "[&_svg]:size-4 [&_svg]:shrink-0"
      )}>
      {children}
    </button>
  )
}

function ToolbarDivider() {
  return <span aria-hidden className="mx-1.5 h-5 w-px bg-[var(--border)]" />
}

function Toolbar() {
  const [editor] = useLexicalComposerContext()
  const [state, setState] = React.useState({
    bold: false, italic: false, underline: false,
    block: "paragraph", canUndo: false, canRedo: false,
  })

  const readState = React.useCallback(() => {
    const selection = $getSelection()
    if (!$isRangeSelection(selection)) return
    const anchorNode = selection.anchor.getNode()
    const element =
      anchorNode.getKey() === "root"
        ? anchorNode
        : anchorNode.getTopLevelElementOrThrow()

    let block = "paragraph"
    if ($isHeadingNode(element)) {
      block = element.getTag() // h1 / h2
    } else if ($isListNode(element)) {
      block = element.getListType() === "number" ? "ol" : "ul"
    } else {
      const listParent = $getNearestNodeOfType(anchorNode, ListNode)
      if (listParent) block = listParent.getListType() === "number" ? "ol" : "ul"
    }

    setState((s) => ({
      ...s,
      bold: selection.hasFormat("bold"),
      italic: selection.hasFormat("italic"),
      underline: selection.hasFormat("underline"),
      block,
    }))
  }, [])

  React.useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => editorState.read(readState)),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => { readState(); return false },
        COMMAND_PRIORITY_CRITICAL
      ),
      editor.registerCommand(CAN_UNDO_COMMAND, (v) => { setState((s) => ({ ...s, canUndo: v })); return false }, COMMAND_PRIORITY_CRITICAL),
      editor.registerCommand(CAN_REDO_COMMAND, (v) => { setState((s) => ({ ...s, canRedo: v })); return false }, COMMAND_PRIORITY_CRITICAL),
    )
  }, [editor, readState])

  const format = (f) => editor.dispatchCommand(FORMAT_TEXT_COMMAND, f)

  const setBlock = (to) => {
    editor.update(() => {
      const selection = $getSelection()
      if (!$isRangeSelection(selection)) return
      if (to === "h1" || to === "h2") {
        $setBlocksType(selection, () =>
          state.block === to ? $createParagraphNode() : $createHeadingNode(to))
      }
    })
  }

  const toggleList = (type) => {
    if (state.block === type) {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined)
    } else {
      editor.dispatchCommand(
        type === "ol" ? INSERT_ORDERED_LIST_COMMAND : INSERT_UNORDERED_LIST_COMMAND,
        undefined
      )
    }
  }

  const toggleLink = () => {
    const url = typeof window !== "undefined" ? window.prompt("Link URL", "https://") : null
    editor.dispatchCommand(TOGGLE_LINK_COMMAND, url || null)
  }

  return (
    <div
      role="toolbar"
      aria-label="Text formatting"
      className="flex flex-wrap items-center gap-0.5 border-b border-input bg-[var(--bg-subtle)] px-2 py-1.5">
      <ToolbarButton label="Bold" active={state.bold} onClick={() => format("bold")}><Bold /></ToolbarButton>
      <ToolbarButton label="Italic" active={state.italic} onClick={() => format("italic")}><Italic /></ToolbarButton>
      <ToolbarButton label="Underline" active={state.underline} onClick={() => format("underline")}><Underline /></ToolbarButton>
      <ToolbarDivider />
      <ToolbarButton label="Heading 1" active={state.block === "h1"} onClick={() => setBlock("h1")}><Heading1 /></ToolbarButton>
      <ToolbarButton label="Heading 2" active={state.block === "h2"} onClick={() => setBlock("h2")}><Heading2 /></ToolbarButton>
      <ToolbarDivider />
      <ToolbarButton label="Bulleted list" active={state.block === "ul"} onClick={() => toggleList("ul")}><List /></ToolbarButton>
      <ToolbarButton label="Numbered list" active={state.block === "ol"} onClick={() => toggleList("ol")}><ListOrdered /></ToolbarButton>
      <ToolbarDivider />
      <ToolbarButton label="Insert link" onClick={toggleLink}><LinkIcon /></ToolbarButton>
      <ToolbarDivider />
      <ToolbarButton label="Undo" disabled={!state.canUndo} onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)}><Undo2 /></ToolbarButton>
      <ToolbarButton label="Redo" disabled={!state.canRedo} onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)}><Redo2 /></ToolbarButton>
    </div>
  )
}

/**
 * RichTextarea — the DaVinci "Rich Textarea": a Lexical-powered rich text editor
 * styled to match the aligned `Textarea` (solid surface, hover/focus border, token
 * colors). The toolbar is extrapolated to Lexical's real capabilities beyond the
 * original reference (B/I/U, H1/H2, lists, link, undo/redo).
 *
 * Uncontrolled: pass `onChange(editorState)` to observe changes. The plain
 * `Textarea` remains the "Poor Textarea" for non-rich input.
 */
function RichTextarea({
  className,
  placeholder = "Write something…",
  ariaLabel = "Rich text editor",
  onChange,
  ...props
}) {
  const initialConfig = {
    namespace: "davinci-rich-textarea",
    theme: editorTheme,
    nodes: [HeadingNode, QuoteNode, ListNode, ListItemNode, LinkNode],
    onError(error) {
      // Surface in dev; never crash the host app.
      if (process.env.NODE_ENV !== "production") console.error(error)
    },
  }

  return (
    <div
      data-slot="rich-textarea"
      className={cn(
        "w-full overflow-hidden rounded-md border border-input bg-[var(--bg-surface)] shadow-xs transition-[color,box-shadow]",
        "focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50",
        className
      )}
      {...props}>
      <LexicalComposer initialConfig={initialConfig}>
        <Toolbar />
        <div className="relative">
          <RichTextPlugin
            contentEditable={
              <ContentEditable
                aria-label={ariaLabel}
                className="min-h-32 max-h-80 overflow-y-auto px-3 py-2.5 text-sm leading-normal text-[var(--fg)] outline-none [&_a]:cursor-pointer"
              />
            }
            placeholder={
              <div className="pointer-events-none absolute left-3 top-2.5 text-sm text-muted-foreground">
                {placeholder}
              </div>
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
          <HistoryPlugin />
          <ListPlugin />
          <LinkPlugin />
          {onChange ? <OnChangePlugin onChange={(editorState) => onChange(editorState)} /> : null}
        </div>
      </LexicalComposer>
    </div>
  );
}

export { RichTextarea }
