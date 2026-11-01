import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const projects = defineCollection({
	loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }),
	schema: z.object({
		title: z.string(),
		subtitle: z.string(),
		summary: z.string(),
		// 截图目录名：src/assets/projects/<shots>/
		shots: z.string(),
		order: z.number(),
		year: z.string(),
		status: z.string(),
		stack: z.array(z.string()),
		highlights: z.array(z.string()).default([]),
		repo: z.string().optional(),
		release: z.string().optional(),
		series: z.string().optional(),
	}),
});

const posts = defineCollection({
	loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/posts' }),
	schema: z.object({
		title: z.string(),
		description: z.string(),
		date: z.coerce.date(),
		tags: z.array(z.string()).default([]),
		draft: z.boolean().default(false),
	}),
});

export const collections = { projects, posts };
