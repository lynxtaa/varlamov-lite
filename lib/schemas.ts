import { z } from 'zod'

export const articleSchema = z.object({
	id: z.number(),
	uri: z.string(),
	published_at: z.string(),
	title: z.string(),
	text: z.string(),
	sharing_text: z.string().optional(),
	sharing_image: z.string().nullish(),
	cut: z.string(),
	topics: z
		.array(
			z.object({
				id: z.number(),
				uri: z.string().optional(),
				name: z.string(),
			}),
		)
		.nullable()
		.optional(),
})

export const articlesSchema = z.object({
	articles: z.array(
		z.object({
			id: z.number(),
			uri: z.string(),
			published_at: z.string(),
			title: z.string(),
			cut: z.string(),
			sharing_text: z.string().optional(),
			sharing_image: z.string().nullish(),
		}),
	),
})
