# CreatorFlow

**CreatorFlow is an agent-native workspace that lets creators research, edit, and prepare content for different publishing platforms through WebMCP-powered capabilities.**

Instead of bolting a chatbot onto a video editor, CreatorFlow exposes the editor's real capabilities — transcript access, moment detection, edit planning, reframing, captioning, platform packaging — as structured tools an agent can call directly. A creator states an outcome; the agent operates the workspace to produce it.

> **Core thesis:** We're not using WebMCP to add an AI chatbot to a video editor. We're using WebMCP to turn the editor's real capabilities into tools an agent can operate, so a creator can express an outcome instead of manually navigating the workflow.

---

## Problem

Producing one piece of short-form content means moving through a long, repetitive pipeline:

- recording
- editing
- rewriting
- resizing
- captioning
- platform formatting
- publishing

None of that repetitive movement is where the creative value lives. The creative work — the idea, the take, the judgment call on what's worth keeping — belongs to the creator. The mechanical work of getting from raw footage to a platform-ready file is the part that eats time and doesn't need a human clicking through every step.

## Solution

CreatorFlow provides an **agent-operable workspace**, not an agent-narrated one:

1. A creator expresses an outcome in plain language.
2. The agent calls structured WebMCP tools exposed by the workspace.
3. CreatorFlow performs the actual work — reading state, planning edits, applying them, reformatting, captioning, packaging for a platform.
4. The creator reviews and approves; nothing ships without them.

The workspace UI and the agent operate on the **same underlying state**, so what the agent does is always visible, inspectable, and reversible by the human in front of the screen.

## Example

**Creator:** "Find the strongest 30 seconds and make a vertical short."

The agent breaks this into a tool-call sequence against CreatorFlow's WebMCP surface:

```
get_project_state    → understand what's currently loaded
get_transcript        → read the transcript for the source footage
find_best_moment      → identify the strongest ~30s segment
create_edit_plan      → propose a structured edit for that segment
apply_edit_plan       → commit the plan to the project timeline
change_aspect_ratio   → reframe the clip to vertical (9:16)
add_captions          → generate and place captions
```

**Creator:** "Prepare this for LinkedIn."

```
prepare_for_platform  → adapt the vertical short's format, length, and metadata for LinkedIn
```

At every point, the creator can inspect what changed, undo it, or redirect the agent — the agent is operating the workspace, not replacing the creator's judgment.

## Human + Agent

| Creator | Agent |
|---|---|
| Intent | Navigation |
| Taste | Repetitive operations |
| Approval | Formatting |
| Final decision | Preparation |

The split is deliberate: the agent absorbs the mechanical steps between intent and output; the creator keeps every decision that actually requires judgment.

## WebMCP Tools

CreatorFlow exposes its capabilities as WebMCP tools. Each tool wraps a real operation in the workspace — none of them are decorative; each one reads or mutates the actual project state that the UI also renders.

| Tool | Purpose | Input | Mutates state? |
|---|---|---|---|
| `get_project_state` | Return the current project's state — loaded assets, timeline, edit history — so the agent can reason about what exists before acting. | *(none, or project ID)* | No |
| `get_transcript` | Retrieve the transcript for a piece of source footage. | Source/asset reference | No |
| `find_best_moment` | Analyze a transcript/timeline and identify the strongest segment for a given target (e.g. length, theme). | Asset reference, target duration, optional criteria | No |
| `create_edit_plan` | Produce a structured, inspectable edit plan (cuts, ordering, timing) without applying it. | Source segment(s), target outcome | No |
| `apply_edit_plan` | Commit a previously created edit plan to the project's timeline. | Edit plan | **Yes** |
| `change_aspect_ratio` | Reframe a clip or project to a target aspect ratio (e.g. vertical 9:16, square 1:1). | Target aspect ratio, clip/project reference | **Yes** |
| `add_captions` | Generate and place captions on a clip or project. | Clip/project reference, style options | **Yes** |
| `prepare_for_platform` | Adapt an existing edit's format, duration, and metadata to a target platform's conventions. | Target platform, project/clip reference | **Yes** |
| `get_available_platforms` | List the platforms CreatorFlow knows how to prepare content for, and their formatting constraints. | *(none)* | No |

Read-only tools let the agent build context safely before acting. Mutating tools change project state exactly the way the corresponding UI action would — through the same shared domain operations, not a side channel.

## Architecture

```
        ChatGPT
           │
           ▼
        WebMCP
           │
           ▼
   CreatorFlow Tools
           │
           ▼
Shared Domain Operations
           │
           ▼
        Zustand
           │
           ▼
    CreatorFlow UI
```

The agent never mutates state directly. Every tool call routes through the same domain operations that the UI's own controls use, backed by a single Zustand store. This is what keeps agent actions and human actions consistent — there is one source of truth, not two parallel paths that can drift apart.

## Why WebMCP?

Traditional web applications expose interfaces designed primarily for humans: buttons, forms, drag targets, modals. An agent that wants to operate one of these applications has to reverse-engineer that interface — clicking, scraping, guessing at DOM structure — with no guarantee the result is correct or stable.

CreatorFlow instead exposes its meaningful capabilities as tools an agent can call directly, with typed inputs and clear semantics. That changes the interaction model from:

**"Click through the editor"**

to:

**"Tell the workspace the outcome."**

This project is one exploration of that model applied to a content-editing workflow — not a claim that agent-operable interfaces or WebMCP itself are new or unique to CreatorFlow.

## Limitations

This is a demo, and it is scoped deliberately:

- Uses **deterministic local data** — no live ingestion pipeline.
- **No external publishing APIs** — nothing is actually posted anywhere.
- **No OAuth** — there is no real account or platform authentication.
- **No production video rendering** — edits are represented and previewed, not rendered to final broadcast-quality output.
- **Platform preparation is demonstrated, not actual posting** — `prepare_for_platform` adapts format and metadata; it does not publish.

## Run locally

```bash
git clone https://github.com/Mario-World/CreatorFlow.git
cd CreatorFlow
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

## License

MIT
