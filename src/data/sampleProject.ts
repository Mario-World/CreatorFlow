import { Project, TranscriptSegment, PlatformPublishData, PlatformId } from '@/types';

export const SAMPLE_PROJECT: Project = {
  id: 'proj_creatorflow_01',
  title: 'How to Fine-tune a Model Without Code',
  type: 'Vertical Video (9:16)',
  duration: 127,
  durationFormatted: '02:07',
};

export const SAMPLE_TRANSCRIPT: TranscriptSegment[] = [
  {
    id: 'seg_1',
    start: 0,
    end: 8,
    startFormatted: '00:00',
    endFormatted: '00:08',
    text: 'Most people think fine-tuning an AI model requires deep machine learning code.',
  },
  {
    id: 'seg_2',
    start: 8,
    end: 18,
    startFormatted: '00:08',
    endFormatted: '00:18',
    text: 'They assume you need a cluster of GPUs and months of Python scripts.',
  },
  {
    id: 'seg_3',
    start: 18,
    end: 31,
    startFormatted: '00:18',
    endFormatted: '00:31',
    text: 'Here is the truth: you can fine-tune custom AI models today with zero code.',
  },
  {
    id: 'seg_4',
    start: 31,
    end: 48,
    startFormatted: '00:31',
    endFormatted: '00:48',
    text: 'Without any technical knowledge in AI engineering, you take your domain knowledge, curate your dataset, and train a specialized model in minutes.',
  },
  {
    id: 'seg_5',
    start: 48,
    end: 66,
    startFormatted: '00:48',
    endFormatted: '01:06',
    text: 'Instead of spending fifty thousand dollars building from scratch, no-code fine-tuning adapts open weights to your exact voice.',
  },
  {
    id: 'seg_6',
    start: 66,
    end: 85,
    startFormatted: '01:06',
    endFormatted: '01:25',
    text: 'Platforms now automate LoRA adapters, quantization, and hyperparameter tuning in the background.',
  },
  {
    id: 'seg_7',
    start: 85,
    end: 106,
    startFormatted: '01:25',
    endFormatted: '01:46',
    text: "Your unfair advantage isn't writing PyTorch—it's having the proprietary business data that makes the model smart.",
  },
  {
    id: 'seg_8',
    start: 106,
    end: 127,
    startFormatted: '01:46',
    endFormatted: '02:07',
    text: 'If you want to build domain-specific AI without writing code, start fine-tuning your data today.',
  },
];

export const INITIAL_PUBLISHING_DATA: Record<PlatformId, PlatformPublishData> = {
  linkedin: {
    platform: 'linkedin',
    name: 'LinkedIn',
    format: '9:16 Vertical Video + Thought Leadership Post',
    title: 'How to Fine-tune a Model Without Code',
    caption: `You don't need a PhD in AI Engineering to fine-tune high-performance models in 2026.

Here is what most teams get wrong:
They think fine-tuning means writing complex PyTorch scripts and managing CUDA drivers.

The reality:
1. No-Code Adaptation: Modern no-code platforms automate LoRA adapters and quantization.
2. Data > Code: Your competitive advantage is proprietary domain knowledge, not GPU engineering.
3. Speed to Market: Deploy domain-specific models in hours instead of quarters.

Here is the exact framework to fine-tune your first model without writing a single line of code 🧵👇

#AIEngineering #NoCode #FineTuning #MachineLearning #CreatorEconomy`,
    description: 'How you can do this without technical knowledge in AI Engineering',
    hashtags: ['#AIEngineering', '#NoCode', '#FineTuning', '#MachineLearning', '#CreatorEconomy'],
    previewHeadline: 'LinkedIn: How to Fine-tune a Model Without Code',
    status: 'Prepared for publishing',
  },
  youtube: {
    platform: 'youtube',
    name: 'YouTube',
    format: '9:16 Vertical Short (1080x1920)',
    title: 'How to Fine-tune a Model Without Code (AI Engineering Guide)',
    caption: 'How you can fine-tune AI models without technical knowledge in AI engineering.',
    description: `How you can do this without technical knowledge in AI Engineering.

Chapters:
00:00 The No-Code AI Fine-Tuning Shift
00:18 The 30s Core Hook: Zero-Code Custom Models
00:48 LoRA Adapters & Dataset Curation
01:25 The Business Moat: Domain Data vs Foundational Weights`,
    hashtags: ['#FineTuning', '#NoCodeAI', '#AIEngineering', '#Shorts', '#LLM'],
    previewHeadline: 'YouTube Short: How to Fine-tune a Model Without Code',
    status: 'Prepared for publishing',
  },
  instagram: {
    platform: 'instagram',
    name: 'Instagram',
    format: '9:16 Vertical Reel (1080x1920)',
    title: 'Fine-tune AI Models with Zero Code (00:18 - 00:48)',
    caption: `Stop writing boilerplate ML code. 🤯 You can fine-tune frontier AI models today without technical knowledge in AI engineering!

Save this reel for your next AI project build! 💡 #NoCodeAI #FineTuning #AIEngineering #TechCreator`,
    description: 'Instagram Reel preparation with punchy hook and vertical safe-zone overlay.',
    hashtags: ['#NoCodeAI', '#FineTuning', '#AIEngineering', '#TechCreator', '#Reels'],
    previewHeadline: 'Reel: How to Fine-tune a Model Without Code',
    status: 'Prepared for publishing',
  },
  x: {
    platform: 'x',
    name: 'X (Twitter)',
    format: '9:16 Video Clip + Launch Thread',
    title: 'How to Fine-tune a Model Without Code',
    caption: `You don't need to write Python to fine-tune an AI model.

Here is how non-technical founders and creators can specialize open models with zero code 🧵👇

1/ The Big Lie:
You were told fine-tuning requires a cluster of H100s and a PhD. In reality, LoRA adapters make it a dataset problem, not a code problem.

2/ How to do it without code:
• Step 1: Export 100 high-signal examples in JSONL format
• Step 2: Ingest into modern no-code fine-tuning platforms
• Step 3: Test deterministic eval benchmarks
• Step 4: Deploy your domain adapter endpoint

3/ Your Moat:
Your proprietary business data is your moat—not writing PyTorch.`,
    description: 'How you can do this without technical knowledge in AI Engineering',
    hashtags: ['#AIEngineering', '#NoCodeAI', '#FineTuning', '#BuildInPublic'],
    previewHeadline: 'X Thread: How to Fine-tune a Model Without Code',
    status: 'Prepared for publishing',
  },
  medium: {
    platform: 'medium',
    name: 'Medium',
    format: 'Technical Long-Form Article (Markdown)',
    title: 'How to Fine-tune a Model Without Code: The Non-Technical Guide to AI Engineering',
    caption: 'A practical blueprint for operators and creators to customize frontier models without writing a single line of Python.',
    description: 'How you can do this without technical knowledge in AI Engineering',
    hashtags: ['#ArtificialIntelligence', '#MachineLearning', '#NoCode', '#Engineering'],
    previewHeadline: 'Medium Article: How to Fine-tune a Model Without Code',
    status: 'Prepared for publishing',
  },
};
