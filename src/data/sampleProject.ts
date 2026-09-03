import { Project, TranscriptSegment, PlatformPublishData, PlatformId } from '@/types';

export const SAMPLE_PROJECT: Project = {
  id: 'proj_webmcp_01',
  title: 'Building with WebMCP',
  type: 'Video',
  duration: 92,
  durationFormatted: '01:32',
};

export const SAMPLE_TRANSCRIPT: TranscriptSegment[] = [
  {
    id: 'seg_1',
    start: 0,
    end: 8,
    startFormatted: '00:00',
    endFormatted: '00:08',
    text: 'Most websites were designed for humans.',
  },
  {
    id: 'seg_2',
    start: 8,
    end: 18,
    startFormatted: '00:08',
    endFormatted: '00:18',
    text: 'Agents still have to guess how interfaces work.',
  },
  {
    id: 'seg_3',
    start: 18,
    end: 31,
    startFormatted: '00:18',
    endFormatted: '00:31',
    text: 'WebMCP changes that by giving websites structured tools.',
  },
  {
    id: 'seg_4',
    start: 31,
    end: 46,
    startFormatted: '00:31',
    endFormatted: '00:46',
    text: 'Instead of clicking through an interface, an agent can perform meaningful actions.',
  },
  {
    id: 'seg_5',
    start: 46,
    end: 62,
    startFormatted: '00:46',
    endFormatted: '01:02',
    text: 'That means websites can become agent-native.',
  },
  {
    id: 'seg_6',
    start: 62,
    end: 78,
    startFormatted: '01:02',
    endFormatted: '01:18',
    text: 'And creators can use the same idea for repetitive production workflows.',
  },
  {
    id: 'seg_7',
    start: 78,
    end: 92,
    startFormatted: '01:18',
    endFormatted: '01:32',
    text: 'Imagine telling your editor what you want instead of manually searching through hours of footage.',
  },
];

export const INITIAL_PUBLISHING_DATA: Record<PlatformId, PlatformPublishData> = {
  youtube: {
    platform: 'youtube',
    name: 'YouTube',
    format: '16:9 Landscape Video (4K/1080p)',
    title: 'Building with WebMCP: Why Websites Need Structured Agent Tools',
    caption: 'Most websites were designed for humans. WebMCP changes that by giving websites structured tools.',
    description: `Most websites were designed for humans. Agents still have to guess how interfaces work. In this breakdown, we explore how WebMCP provides structured tools so agents perform meaningful actions instead of clicking blindly through UIs.

Chapters:
00:00 The Human UI Limitation
00:18 How WebMCP Gives Structured Tools
00:46 Becoming Agent-Native
01:02 Creative Production Workflows with Agents`,
    hashtags: ['#WebMCP', '#AI', '#AgenticAI', '#DevTools', '#NextJS'],
    previewHeadline: 'Building with WebMCP: The Agent-Native Web Era',
    status: 'Prepared for publishing',
  },
  instagram: {
    platform: 'instagram',
    name: 'Instagram',
    format: '9:16 Vertical Reel (1080x1920)',
    title: 'Websites weren’t built for AI agents — until WebMCP',
    caption: `Websites were built for human fingers, not AI agents. 🤯

WebMCP changes everything by giving web apps structured tools. Instead of an agent clicking around guessing buttons, it executes deterministic actions directly.

Imagine an editor that takes your vision and cuts footage instantly. That is CreatorFlow.

Save this for your next AI workflow build! 💡`,
    description: 'Instagram Reel preparation with punchy hook and vertical safe-zone overlay.',
    hashtags: ['#CreatorEconomy', '#AITools', '#WebMCP', '#VideoEditing', '#Productivity'],
    previewHeadline: 'Reel: Websites weren’t built for AI agents',
    status: 'Prepared for publishing',
  },
  linkedin: {
    platform: 'linkedin',
    name: 'LinkedIn',
    format: 'Video Post + Thought Leadership Copy',
    title: 'Why the next wave of software is Agent-Native (and what it means for creators)',
    caption: `Most websites were designed for human eyeballs and cursor clicks.

When AI agents try to browse, they’re forced to guess how brittle DOM elements work.

WebMCP flips this paradigm:
1. Web applications expose structured tools directly to agents.
2. Actions become deterministic, reliable, and instantaneous.
3. Creators can delegate repetitive editing workflows through natural intent rather than manual scrubbing.

We built CreatorFlow as a working demonstration of this architecture.

Are you preparing your web applications to be agent-native? Let's discuss in the comments.`,
    description: 'Professional video post with executive breakdown and high-signal takeaway.',
    hashtags: ['#ArtificialIntelligence', '#SoftwareEngineering', '#ProductDesign', '#WebMCP', '#FutureOfWork'],
    previewHeadline: 'Thought Leadership: The Architecture of Agent-Native Web Apps',
    status: 'Prepared for publishing',
  },
  x: {
    platform: 'x',
    name: 'X (Twitter)',
    format: '2:20 Video Clip + Launch Thread',
    title: 'Websites were designed for humans. WebMCP makes them agent-native.',
    caption: `Most websites were designed for humans. Agents still have to guess how interfaces work.

WebMCP gives websites structured tools.

Instead of clicking through an interface, an agent performs meaningful actions.

Here's how we built CreatorFlow using this exact pattern 🧵👇`,
    description: 'Optimized short video clip with thread opener for high engagement.',
    hashtags: ['#WebMCP', '#buildinpublic', '#AIagents', '#devtools'],
    previewHeadline: 'X Thread: Most websites were designed for humans...',
    status: 'Prepared for publishing',
  },
  medium: {
    platform: 'medium',
    name: 'Medium',
    format: 'Technical Deep Dive & Video Embed',
    title: 'Architecting Agent-Native Workspaces: Lessons from Building CreatorFlow with WebMCP',
    caption: 'A deep dive into how structured agent tools replace brittle UI automation for creative tooling.',
    description: `## Introduction: The Human-Interface Bottleneck
Most websites were designed for humans. Visual layouts, drop-down menus, and modal dialogs cater to human cognitive processing. But when an autonomous agent tries to navigate these interfaces, friction compounds.

## Enter WebMCP: Structured Tools for the Web
WebMCP changes that by giving websites structured tools. Instead of clicking through an interface, an agent can perform meaningful actions with typed parameters, verified states, and transactional rollbacks.

## Applying the Pattern to Creator Workflows
Imagine telling your editor what you want instead of manually searching through hours of footage. In this article, we break down the Zustand domain operations pattern that powers CreatorFlow.`,
    hashtags: ['#WebDevelopment', '#ArtificialIntelligence', '#Technology', '#SoftwareArchitecture'],
    previewHeadline: 'Medium Publication: Architecting Agent-Native Workspaces',
    status: 'Prepared for publishing',
  },
};
