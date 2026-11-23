import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const workCollection = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/work' }),
  schema: z.object({
    title: z.string(),
    tagline: z.string(),
    category: z.enum(['web', 'design', 'video', 'opensource']),
    liveUrl: z.string().url().optional(),
    repoUrl: z.string().url().optional(),
    status: z.enum(['production', 'beta', 'concept']),
    techStack: z.array(z.string()),
    metrics: z.record(z.string()).optional(),
    featuredOrder: z.number().int()
  })
});

const journalCollection = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/journal' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishedDate: z.date(),
    type: z.enum(['essay', 'doc']),
    readingTimeMinutes: z.number().int(),
    tags: z.array(z.string())
  })
});

const contributorCollection = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/contributors' }),
  schema: z.object({
    projectName: z.string(),
    tagline: z.string(),
    repoUrl: z.string().url(),
    primaryLanguage: z.string(),
    goodFirstIssuesCount: z.number().int(),
    contributionGuideUrl: z.string().url(),
    difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
    activeAreas: z.array(z.string())
  })
});

export const collections = {
  work: workCollection,
  journal: journalCollection,
  contributors: contributorCollection
};
