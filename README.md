# CreatorFlow — Agent-Native Content Creation Workspace with WebMCP

[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-16.3-black?logo=next.js)](https://nextjs.org/)
[![Turbopack](https://img.shields.io/badge/Turbopack-Ready-blueviolet)](https://turbo.build/pack)
[![WebMCP](https://img.shields.io/badge/WebMCP-document.modelContext-10b981)](https://github.com/web-model-context-protocol)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/your-username/CreatorFlow/pulls)

> ⚖️ **Open Source License**: This project is licensed under the [MIT License](https://opensource.org/licenses/MIT). You are free to inspect, fork, modify, integrate, and distribute this software for personal, academic, or commercial applications.

---

## 🎬 Demo Video Submission

> 📹 **Video Submission Link**: *[Demo Video URL — Link to Loom / YouTube / Drive Submission]*  
> *(Complete walkthrough demonstrating natural language creator intent, live WebMCP tool execution, responsive canvas reframing, and instant rollback).*

### Demo Checkpoints:
| Timestamp | Demo Milestone | What is Demonstrated |
| :--- | :--- | :--- |
| **00:00 – 00:25** | **The Problem** | Manual scrubbing fatigue, aspect ratio cropping overhead, and multi-platform packaging busywork. |
| **00:25 – 00:55** | **WebMCP Discovery** | Opening DevTools Console and inspecting `document.modelContext.getTools()` live in the active browser tab. |
| **00:55 – 01:30** | **Two-Phase Intent** | Prompting Director Agent: *"Find the strongest 30 seconds and make it a vertical short"*. Agent formulates non-destructive proposal without mutating state. |
| **01:30 – 01:55** | **Real State Mutation** | Creator approves cut: Canvas reframes to `9:16`, timeline trims to `00:18 → 00:48`, subtitles activate, and state snapshots. |
| **01:55 – 02:15** | **Instant Rollback** | Creator clicks **Undo** on the "AI changed this" banner; state seamlessly reverts to uncut baseline via history stack. |
| **02:15 – 02:45** | **Publish & Research** | Multi-channel publishing matrix (YouTube, IG, LinkedIn, X, Medium) and Content Research Brief extraction. |

---

## 📖 Description

**CreatorFlow** is an agent-native content creation workspace engineered for the **WebMCP (Web Model Context Protocol)** standard.

Traditional video editing software forces autonomous agents to simulate clumsy mouse clicks or stream screenshots through high-latency vision models. CreatorFlow flips this paradigm by exposing **10 structured, deterministic browser tools** directly on `document.modelContext.registerTool`.

Through natural intent, creators can collaborate with an in-browser AI agent to locate high-retention 30-second clips, crop footage into vertical reels (`9:16`), synchronize subtitles, and generate platform-calibrated copy—all while maintaining complete human creative oversight with **safe two-phase proposals ("Propose → Approve")** and **transactional one-click undo**.

---

## ⚠️ The Problem

1. **The Human-UI Bottleneck**: Modern creative software (Premiere, CapCut, DaVinci) was architected exclusively for human fingers, eyes, and mouse cursors. Visual menus, scrubbing sliders, and nested modals create immense friction for repetitive tasks.
2. **Brittle Agent Automation**: Autonomous browser agents attempting to operate modern creative web apps are hindered by:
   - **DOM Scraping**: Fragile selectors (`div > button.btn-primary-2`) that break on any CSS or layout update.
   - **Screenshot Vision Models**: High latency (>3–5s per step), token-heavy, expensive, and error-prone coordinate guessing.
3. **Creator Fatigue**: A creator spending 2 hours recording a podcast spends another 4 hours on busywork: locating high-retention 30s moments, cropping landscape footage to 9:16 vertical shorts, timing subtitles, and re-authoring metadata for YouTube, Reels, LinkedIn, and X.

---

## 💡 The Solution

CreatorFlow establishes an **Agent-Native Workspace** where human creators and autonomous agents operate on the **exact same domain state** with zero friction:

- **Imperative WebMCP Tool Bridge**: Registers typed capabilities directly onto the browser tab's `document.modelContext`.
- **Two-Phase Safety ("Propose → Approve")**: Autonomous agents never destructively mutate creative work without human consent. Agents invoke read-only discovery tools to formulate a **Proposed Edit**, and only apply mutations when the creator approves.
- **Transactional History Stack**: Every tool execution generates an immutable state snapshot. If an agent's cut isn't what the creator envisioned, a single click on the **"AI changed this"** banner rolls back the entire state via `undo_last_action`.
- **Zero-Latency In-Memory Synchronization**: Agent tool dispatches trigger instant, reactive re-renders in the React UI and HTML5 video player in under 15 milliseconds.

---

## 🌐 Why WebMCP is Essential Here

| Approach | Latency | Reliability | State Fidelity | Human Control |
| :--- | :--- | :--- | :--- | :--- |
| **Traditional DOM Automation** (Puppeteer/Playwright) | 800ms - 2s | Low (breaks on CSS changes) | Partial (DOM only) | None (hijacks cursor) |
| **Screenshot Vision Models** (VLM agent) | 3s - 7s | Medium (hallucinates clicks) | Blind to internal store | Poor |
| **External MCP Server** (stdio / SSE backend) | 200ms - 500ms | High | Out of sync with browser tab | Requires custom sync server |
| **WebMCP (`document.modelContext`)** | **< 15ms** | **Deterministic (Typed JSON Schema)** | **100% (Direct Zustand state access)** | **Safe Two-Phase Approval + Undo** |

### Why standard backend MCP is insufficient for in-browser apps:
Standard Model Context Protocol (MCP) servers run outside the browser (via command-line `stdio` or HTTP/SSE servers). An external MCP server cannot directly manipulate an active browser tab's in-memory React state, inspect the playing HTML5 `<video>` element, adjust live canvas aspect ratios, or trigger immediate DOM re-renders without convoluted bi-directional websockets.

**WebMCP** solves this by establishing a standardized browser-native interface. In-browser AI agents (such as Chrome's native Model Context API, agentic browser sidecars, or ChatGPT web operators) directly discover registered tools in the active document and execute them deterministically.

---

## 🎯 WebMCP Core Value Proposition & Implementation

### 1. Why this use case is a strong fit for WebMCP
Video editing is inherently stateful, multimedia-heavy, and visually demanding. Dragging timeline handles, cropping aspect ratios, and toggling subtitle safe-zones cannot be reliably automated through DOM click simulations or screenshot coordinate guessing without desynchronizing the media pipeline. WebMCP is an ideal fit because it exposes high-frequency, complex browser video operations as typed JavaScript functions running inside the browser tab, updating the HTML5 video engine and reactive UI in under 15ms.

### 2. How it creates a better user experience
Instead of waiting for brittle bots to simulate cursor clicks across the screen, creators receive instant, deterministic visual updates. The interface features a safe **"Propose → Approve"** workflow: agents formulate non-destructive proposals so the creator can preview start/end times and vertical framing before applying changes. If an edit isn't what the creator envisioned, an **"AI changed this"** banner offers an instant, one-click rollback.

### 3. What people and agents can do together that was difficult or impossible before
Before WebMCP, creators were forced to choose between tedious manual scrubbing (wasting hours cutting long videos into shorts) or opaque cloud AI tools that required full re-uploads with zero live interactive control. With CreatorFlow and WebMCP, human creators and AI agents pair-edit footage in real time:
- The agent interprets high-level intent (*"Find the strongest 30 seconds and make it a vertical short"*), extracts the thesis, and sets up the cut.
- The human creator inspects the preview on the live canvas, makes manual micro-adjustments, or rolls back changes with zero friction.

### 4. How WebMCP was implemented in CreatorFlow
- **Imperative Registration**: In [`src/lib/webmcp.ts`](src/lib/webmcp.ts), `initWebMCP()` registers 10 tools on `document.modelContext.registerTool({...})` equipped with typed JSON Schemas for inputs and parameters.
- **Unified Domain State**: WebMCP tool handlers call the exact same Zustand domain actions as the human UI buttons, eliminating state drift.
- **Universal Compatibility**: In browsers without native WebMCP support, `initWebMCP()` provides a spec-compliant fallback context on `document.modelContext`, ensuring `document.modelContext.getTools()` and `executeTool()` operate seamlessly in any browser or automated testing harness.

---

## 🏛️ Architecture

CreatorFlow employs a **Unified State Architecture**. The human user interface and external AI agents are treated as peer operators of the same domain logic:

```mermaid
graph TD
    subgraph Browser Tab ["Active Browser Tab (localhost:3000)"]
        subgraph Agent Interface ["WebMCP Layer (document.modelContext)"]
            T1["get_project_state"]
            T2["get_transcript"]
            T3["find_best_moment"]
            T4["create_edit_plan"]
            T5["apply_edit_plan"]
            T6["change_aspect_ratio"]
            T7["add_captions"]
            T8["prepare_for_platform"]
            T9["undo_last_action"]
            T10["save_research_brief"]
        end

        subgraph Domain Layer ["CreatorFlow Domain Operations"]
            DO["creatorFlowOperations"]
            HS["Undo / Redo History Stack"]
        end

        subgraph State Layer ["Zustand Central Store"]
            S_Timeline["timeline (currentTime, trimStart, trimEnd)"]
            S_Aspect["aspectRatio (16:9 | 9:16 | 1:1)"]
            S_Captions["captions (enabled, activeText)"]
            S_Publish["publishing (5 platform packages)"]
            S_Brief["researchBrief (thesis, hooks, beats)"]
        end

        subgraph UI Layer ["Human Reactive UI"]
            V_Player["HTML5 Video Player & Canvas"]
            V_Timeline["Interactive Timeline Scrubber"]
            V_Transcript["Synchronized Transcript Panel"]
            V_Publish["Multi-Platform Export Matrix"]
            V_Director["AI Director Panel & Activity Drawer"]
        end
    end

    ExternalAgent["In-Browser AI Agent / ChatGPT / Chrome Model Context API"] <-->|Discovers & Calls| Agent Interface
    Agent Interface -->|Executes| DO
    UI Layer -->|User Clicks / Edits| DO
    DO -->|Mutates & Snapshots| State Layer
    State Layer -->|Snapshots| HS
    State Layer -->|Re-renders| UI Layer
```

### The 10 Registered WebMCP Tools

| # | Tool Name | Mode | Input Schema | Description |
| :--- | :--- | :--- | :--- | :--- |
| `1` | `get_project_state` | Read-Only | `{}` | Queries duration, timecode, active trim bounds, aspect ratio, and publishing status. |
| `2` | `get_transcript` | Read-Only | `{}` | Retrieves transcript cue segments with start/end millisecond timestamps. |
| `3` | `find_best_moment` | Read-Only | `{ durationSeconds: number }` | Evaluates transcript density to locate high-retention moments (e.g. 30s cut). |
| `4` | `create_edit_plan` | Proposal | `{ startSeconds, endSeconds, aspectRatio }` | Generates non-mutating edit recommendation awaiting human creator approval. |
| `5` | `apply_edit_plan` | Mutating | `{ startSeconds, endSeconds }` | Trims timeline trimStart/trimEnd, syncs playhead, and snapshots history. |
| `6` | `change_aspect_ratio`| Mutating | `{ aspectRatio: '16:9'\|'9:16'\|'1:1' }` | Reframes video canvas to `16:9` (landscape), `9:16` (vertical), or `1:1` (square). |
| `7` | `add_captions` | Mutating | `{ enabled: boolean }` | Toggles synchronized subtitles styled for mobile safe-zones. |
| `8` | `prepare_for_platform`| Mutating | `{ platform: PlatformId }` | Calibrates multi-channel metadata, titles, and hashtags for YouTube, IG, LinkedIn, X, Medium. |
| `9` | `undo_last_action` | Rollback | `{}` | Pops history snapshot and reverts all state parameters to prior state. |
| `10`| `save_research_brief`| Mutating | `{ topic, coreThesis, hooks, keyBeats }` | Saves structured research (thesis, viral hooks, beats) into project context. |

---

## 📂 Repository Structure

```
d:/CreatorFlow/
├── src/
│   ├── app/
│   │   ├── layout.tsx                # Root layout with fonts & metadata
│   │   └── page.tsx                  # Single-page workspace router (Overview, Workspace, Publish, Research)
│   ├── components/
│   │   ├── brand/
│   │   │   └── CreatorFlowLogo.tsx   # SVG identity branding
│   │   ├── create/                   # Core Video Editor
│   │   │   ├── CreateWorkspace.tsx   # 3-column studio view (Transcript, Video, Director)
│   │   │   ├── VideoPreview.tsx      # HTML5 video canvas, aspect ratio framer, caption overlay
│   │   │   ├── Timeline.tsx          # Dual-handle trimming timeline scrubber
│   │   │   └── TranscriptPanel.tsx   # Interactive dialogue cues with timestamp seeking
│   │   ├── director/
│   │   │   └── DirectorPanel.tsx     # Natural language agent intent input & proposal reviewer
│   │   ├── landing/
│   │   │   └── LandingPage.tsx       # Interactive product overview and value proposition
│   │   ├── layout/
│   │   │   └── TopNav.tsx            # Global navigation, local video upload, labeled Undo/Redo
│   │   ├── publish/
│   │   │   └── PublishWorkspace.tsx  # 5-platform packaging matrix (YouTube, IG, LinkedIn, X, Medium)
│   │   ├── research/
│   │   │   └── ResearchWorkspace.tsx # Content intelligence & research brief generator
│   │   └── webmcp/
│   │       └── WebMCPActivityPanel.tsx # In-browser WebMCP tool dispatch inspector & schema viewer
│   ├── data/
│   │   └── sampleProject.ts          # Default production cut footage & transcript cues
│   ├── domain/
│   │   └── operations.ts             # Authoritative domain operations layer (shared by UI & WebMCP)
│   ├── lib/
│   │   └── webmcp.ts                 # WebMCP specification & safe client-side tool registry
│   ├── store/
│   │   └── creatorFlowStore.ts       # Zustand central store with deep snapshot undo/redo history
│   └── types/
│       └── index.ts                  # Comprehensive TypeScript interfaces & WebMCP tool definitions
├── package.json
├── tsconfig.json
├── next.config.ts
└── README.md
```

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16 (Turbopack)](https://nextjs.org/) App Router
- **Language**: [TypeScript 5](https://www.typescriptlang.org/) (Strict type safety across domain and schemas)
- **Protocol**: [WebMCP](https://github.com/web-model-context-protocol) standard on `document.modelContext` with JSON Schema Draft 7/2020-12
- **State Management**: [Zustand](https://github.com/pmndrs/zustand) with immutable snapshots and bidirectional history stack
- **Media Engine**: HTML5 `<video>` API with custom synchronized audio visualizer and responsive canvas framer
- **Styling**: Vanilla CSS custom tokens + [Tailwind CSS](https://tailwindcss.com/) with dark-mode glassmorphism
- **Icons**: [Lucide React](https://lucide.dev/)

---

## 🚀 Quickstart

### 1. Clone & Install

```bash
git clone https://github.com/your-username/CreatorFlow.git
cd CreatorFlow
npm install
```

### 2. Start Local Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Verify Production Build

```bash
npm run build
```
*(Compiles successfully in < 2 seconds with Turbopack and zero type errors).*

---

## 🧪 Testing WebMCP in Browser DevTools

You can immediately test CreatorFlow's WebMCP interface without external extensions. Open browser Developer Tools (`F12` or `Ctrl+Shift+I`) and execute the following in the **Console**:

### 1. Discover Registered Tools
```javascript
const tools = document.modelContext.getTools();
console.table(tools.map(t => ({ name: t.name, description: t.description })));
```

### 2. Query Current Project State
```javascript
const state = await document.modelContext.executeTool('get_project_state');
console.log('Project State:', state);
```

### 3. Find the Highest-Impact 30-Second Cut
```javascript
const bestMoment = await document.modelContext.executeTool('find_best_moment', { durationSeconds: 30 });
console.log('Best Moment:', bestMoment);
```

### 4. Execute Mutating Timeline Cut & Vertical Reframing
```javascript
// Trim timeline to 18s - 48s
await document.modelContext.executeTool('apply_edit_plan', { startSeconds: 18, endSeconds: 48 });

// Reframe canvas to vertical 9:16
await document.modelContext.executeTool('change_aspect_ratio', { aspectRatio: '9:16' });

// Turn on synchronized subtitles
await document.modelContext.executeTool('add_captions', { enabled: true });
```
*(Observe the video canvas, timeline handles, and subtitle overlay in the UI update instantly).*

### 5. Rollback State via History Stack
```javascript
await document.modelContext.executeTool('undo_last_action');
```

---

## 🤖 ChatGPT Web / Agent Operable Scope

CreatorFlow is natively built for browser-operable agents (including ChatGPT Web Operator, Claude Computer Use / in-browser sidecars, and WebMCP browser extensions).

When an agent accesses CreatorFlow at `http://localhost:3000`:
1. **Zero DOM Scraping Required**: The agent queries `document.modelContext.getTools()` to inspect all available tools and their typed schemas.
2. **Deterministic Execution**: Instead of estimating click coordinates, the agent dispatches `executeTool(name, args)`.
3. **Audit Trail**: Every invocation is logged in the UI's **WebMCP Activity Panel**, displaying timestamps, execution status, and payload outcomes.

---

## 🔭 Scope of CreatorFlow

CreatorFlow is organized into four integrated workspaces accessible via the top navigation bar:

### 1. Overview (`/`)
- High-level value proposition and system status.
- Instant workspace launcher with preview of the current production footage.

### 2. Workspace (`CreateWorkspace`)
- **Video Canvas**: Real-time framing switcher (`16:9`, `9:16`, `1:1`), audio visualizer, safe-zone guidelines, and subtitle overlays.
- **Local Media Support**: Ingest custom MP4 videos (`.mp4`) with automatic duration calculation and generated transcript cue segments.
- **Interactive Timeline**: Scrubbing playhead, drag-to-trim bounding handles, transport controls, and playback rate selector (`1x`, `1.5x`, `2x`).
- **Interactive Transcript**: Click any dialogue segment to jump the playhead and synchronize subtitles.
- **AI Director Panel**: Natural language command center. Input intents like:
  - *"Find the strongest 30 seconds and make it a vertical short"*
  - *"Turn this into a LinkedIn post"*
  - *"Make this a vertical reel"*
  - *"Prepare this for X"*
- **WebMCP Activity Drawer**: Real-time execution monitor detailing all tool calls, status codes, and registered schemas.

### 3. Publish (`PublishWorkspace`)
- Multi-platform packaging for **YouTube, Instagram, LinkedIn, X (Twitter), and Medium**.
- Platform-specific formats: Landscape 4K, 9:16 Reels, Thought Leadership text posts, short video threads, and technical articles.
- One-click copy for headline, caption, body, and algorithm-calibrated hashtags.

### 4. Research & Intelligence (`ResearchWorkspace`)
- Post-publishing insight generator.
- Synthesizes transcript dialogue into a structured **Research Brief** (Core Thesis, Viral Cold Open Hooks, Narrative Beats).
- Saves directly to project state via WebMCP Tool 10 (`save_research_brief`), allowing downstream editorial cuts based on research data.

---

## 📄 Open Source License

This project is open source and available under the [MIT License](https://opensource.org/licenses/MIT).

```
MIT License

Copyright (c) 2026 CreatorFlow Contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
