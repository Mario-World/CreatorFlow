# CreatorFlow — Agent-Native Content Workflow with WebMCP

[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![WebMCP](https://img.shields.io/badge/WebMCP-document.modelContext-10b981)](https://github.com/webmachinelearning/webmcp)

> **CreatorFlow is an agent-native workspace that lets creators research, edit, and prepare content for publishing — with WebMCP turning real workspace capabilities into tools an agent can operate.**

Creators already have ideas, recordings, knowledge, and opinions. The difficult part is everything around publishing: **research → editing → restructuring → formatting → platform preparation**.

CreatorFlow reduces that repetitive work while keeping the creator in control.

## The Core Idea

CreatorFlow is **not an AI creator**. It does not try to replace the creator or become another fully automated video editor.

> **The creator decides what they want. The agent operates the workflow. The creator decides what ships.**

For example:

> “Find the strongest 30 seconds and prepare it as a vertical short.”

Instead of an agent trying to click through buttons, menus, sliders, and timelines, CreatorFlow exposes meaningful application capabilities as **WebMCP tools**. The agent can discover those capabilities and operate the workspace directly.

```
Creator Intent
      ↓
    Agent
      ↓
   WebMCP
      ↓
CreatorFlow Tools
      ↓
Shared Application State
      ↓
CreatorFlow UI
      ↓
Human Review
      ↓
Platform-ready Content
```

## The Problem

Publishing one piece of content across the web often means repeating the same work:

- understand the source material
- find the important section
- cut the video
- change the aspect ratio
- add captions
- restructure the content
- adapt copy for another platform
- prepare the final post

The creative decisions belong to the creator. The repetitive workflow should be easier.

## The Solution

CreatorFlow provides an **agent-operable workspace**, not an agent-narrated one:

1. A creator expresses an outcome in plain language.
2. An agent discovers and calls structured WebMCP tools.
3. CreatorFlow performs the actual workflow operations.
4. The creator reviews, modifies, approves, or undoes the result.

The UI and agent operate on the **same underlying application state**, so agent actions remain visible, inspectable, and reversible.

## Example

**Creator:** “Find the strongest 30 seconds and make a vertical short.”

```
get_project_state
        ↓
get_transcript
        ↓
find_best_moment
        ↓
create_edit_plan
        ↓
apply_edit_plan
        ↓
change_aspect_ratio
        ↓
add_captions
```

Then:

**Creator:** “Prepare this for LinkedIn.”

```
prepare_for_platform
```

The creator can inspect the result and undo or redirect the workflow.

## Human + Agent

| Creator | Agent |
|---|---|
| Intent | Understand workflow |
| Creative direction | Find relevant information |
| Taste | Repetitive operations |
| Review | Formatting |
| Approval | Preparation |
| Final decision | Workflow execution |

> **Human owns the content. Agent reduces the work around it.**

## WebMCP Is the Heart of CreatorFlow

The project is not WebMCP added on top of an editor as a chatbot integration.

CreatorFlow exposes **real capabilities inside the application as structured tools**.

### Registered capabilities

| Tool | Purpose | State |
|---|---|---|
| `get_project_state` | Understand the current project | Read |
| `get_transcript` | Retrieve transcript information | Read |
| `find_best_moment` | Find a useful section of source content | Read |
| `create_edit_plan` | Create an inspectable editing proposal | Proposal |
| `apply_edit_plan` | Apply an approved edit | Mutates |
| `change_aspect_ratio` | Change video framing | Mutates |
| `add_captions` | Enable captions | Mutates |
| `prepare_for_platform` | Prepare content for a target platform | Mutates |
| `undo_last_action` | Revert the latest change | Mutates |
| `save_research_brief` | Save structured research context | Mutates |

The important principle is:

> **WebMCP tools do not create a second application. They operate the capabilities of the existing application.**

## Why WebMCP?

Traditional browser automation asks an agent to operate an interface designed for humans:

```
find button
   ↓
click
   ↓
wait
   ↓
inspect page
   ↓
find timeline
   ↓
drag control
   ↓
inspect result
```

CreatorFlow exposes intent-level capabilities instead:

```
“Make this a vertical short”
          ↓
change_aspect_ratio({
  aspectRatio: "9:16"
})
```

The agent works with the application's **capabilities**, rather than reconstructing how a human would navigate its interface.

That is the WebMCP experiment at the center of CreatorFlow.

## Architecture

```text
                         ┌─────────────────┐
                         │     Creator     │
                         └────────┬────────┘
                                  │
                               Intent
                                  │
                                  ▼
                         ┌─────────────────┐
                         │     Agent       │
                         └────────┬────────┘
                                  │
                              WebMCP
                                  │
                                  ▼
                    ┌─────────────────────────┐
                    │    WebMCP Tool Layer    │
                    │                         │
                    │ Read / Understand       │
                    │ Plan / Edit             │
                    │ Format / Prepare        │
                    │ Undo                    │
                    └────────────┬────────────┘
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │   Domain Operations     │
                    └────────────┬────────────┘
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │     Zustand Store       │
                    │                         │
                    │ Project / Timeline      │
                    │ Transcript / Research   │
                    │ Publishing / History    │
                    └────────────┬────────────┘
                                 │
                         ┌───────┴────────┐
                         ▼                ▼
                  CreatorFlow UI      Activity Log
```

There is a single source of truth. UI actions and WebMCP actions use the same domain operations and project state.

## Agent Activity

CreatorFlow makes WebMCP activity visible:

```
WEBMCP ACTIVITY

✓ get_project_state
✓ get_transcript
✓ find_best_moment

→ create_edit_plan
  Target: 30 second short

Waiting for creator approval...

→ apply_edit_plan
✓ Timeline updated

→ change_aspect_ratio
✓ 9:16

→ add_captions
✓ Captions enabled
```

This gives the creator visibility into what the agent is doing instead of hiding the workflow behind a chat response.

## Human Approval

For creative operations, CreatorFlow follows:

**Propose → Review → Apply**

```
Agent
  ↓
Proposed Edit
  ↓
Creator Review
  ├── Approve
  ├── Modify
  └── Reject
```

Applied changes can be reverted through the history mechanism.

## Core Product

CreatorFlow focuses on three connected capabilities.

### 1. Research

Turn an idea or source material into structured context:

```
Topic
 ↓
Research
 ↓
Core thesis
 ↓
Key points
 ↓
Hooks / angles
 ↓
Saved to project
```

### 2. ClipFlow — Editing Workspace

A lightweight workspace for repetitive creator editing tasks:

- video preview
- timeline
- transcript
- trimming
- moment selection
- captions
- aspect-ratio changes
- edit plans
- undo/history

CreatorFlow is **not intended to replace professional editors**. It focuses on making common creator workflows faster and easier.

### 3. Publish

Prepare content for different publishing destinations:

- YouTube
- Instagram
- LinkedIn
- X
- Medium

Example:

```
One Source
    │
    ├── YouTube → video + title + description
    ├── Instagram → vertical short + caption
    ├── LinkedIn → professional post
    ├── X → short post / thread
    └── Medium → article structure
```

The hackathon version focuses on **platform preparation**, not claiming that content is actually posted to every platform.

## Scope

### Included

- Agent-native workspace
- WebMCP tool registration
- Project state
- Transcript-driven workflow
- Clip editing operations
- Aspect-ratio transformation
- Captions
- Edit planning
- Undo/history
- Research context
- Platform preparation
- WebMCP activity visibility

### Deliberately out of scope

- Full Premiere/DaVinci replacement
- Professional-grade rendering
- Full social publishing infrastructure
- OAuth for every platform
- Autonomous content creation
- Automatic publishing without creator approval

The goal is to demonstrate the **agent-operable workflow**, not build an entire creator platform in a hackathon.

## Technology

- **Next.js** — application framework
- **TypeScript** — application and tool type safety
- **React** — UI
- **Zustand** — shared application state
- **WebMCP** — browser-native agent tool surface
- **HTML5 Video** — media preview
- **CSS / Tailwind** — interface
- **Lucide** — icons

## Repository Structure

```text
CreatorFlow/
│
├── src/
│   ├── app/
│   ├── components/
│   │   ├── create/
│   │   ├── director/
│   │   ├── publish/
│   │   ├── research/
│   │   ├── webmcp/
│   │   └── layout/
│   ├── domain/
│   │   └── operations.ts
│   ├── lib/
│   │   └── webmcp.ts
│   ├── store/
│   │   └── creatorFlowStore.ts
│   ├── data/
│   │   └── sampleProject.ts
│   └── types/
│       └── index.ts
├── package.json
├── next.config.ts
├── tsconfig.json
└── README.md
```

## Running Locally

```bash
git clone https://github.com/Mario-World/CreatorFlow.git
cd CreatorFlow
npm install
npm run dev
```

Open `http://localhost:3000`.

Build for production:

```bash
npm run build
```

## Testing WebMCP

When WebMCP is available in the browser environment, registered tools can be inspected through the document Model Context interface.

### Discover tools

```javascript
const tools = document.modelContext.getTools();

console.table(
  tools.map(tool => ({
    name: tool.name,
    description: tool.description
  }))
);
```

### Read project state

```javascript
await document.modelContext.executeTool(
  "get_project_state"
);
```

### Find a 30-second moment

```javascript
await document.modelContext.executeTool(
  "find_best_moment",
  { durationSeconds: 30 }
);
```

### Change the aspect ratio

```javascript
await document.modelContext.executeTool(
  "change_aspect_ratio",
  { aspectRatio: "9:16" }
);
```

### Undo

```javascript
await document.modelContext.executeTool(
  "undo_last_action"
);
```

The exact availability of these APIs depends on the browser/WebMCP environment being used.

## Hackathon Demo

A concise CreatorFlow demo should show:

1. **The workspace** — source content is loaded.
2. **WebMCP discovery** — registered tools are visible.
3. **Natural-language intent** — “Find the strongest 30 seconds and make it a vertical short.”
4. **Tool execution** — read → plan → edit → reframe → captions.
5. **Visible state changes** — timeline and canvas update.
6. **Human control** — creator reviews and can undo.
7. **Publishing preparation** — “Prepare this for LinkedIn.”

The strongest part of the demo is not the number of screens.

It is showing:

```
Intent
  ↓
WebMCP
  ↓
Tool calls
  ↓
Real application state
  ↓
Visible result
  ↓
Human approval
```

## Hackathon Thesis

CreatorFlow explores a simple idea:

> **The next generation of web applications should not only be designed for humans to click. They should expose meaningful capabilities that agents can understand and operate.**

WebMCP makes that interaction possible directly inside the web application.

CreatorFlow applies that idea to one practical workflow:

**content → editing → preparation → publishing**

The creator remains the author.

The agent becomes the operator.

## Roadmap

Future versions could add:

- richer media ingestion
- stronger transcript analysis
- more editing operations
- real rendering/export
- authenticated platform publishing
- deeper research
- more publishing destinations
- persistent projects
- collaborative creator workflows

The foundation remains the same:

> **Expose the application's real capabilities to agents while keeping humans in control.**

## License

CreatorFlow is released under the MIT License.

```text
MIT License

Copyright (c) 2026 CreatorFlow Contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
```

---

## CreatorFlow

**Your content. Your judgment. Less busywork.**

**Research. Edit. Prepare. Publish.**

**Powered by WebMCP.**
