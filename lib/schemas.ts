import myzod from 'myzod'

export const articleSchema = myzod.object(
	{
		id: myzod.number(),
		uri: myzod.string(),
		published_at: myzod.string(),
		title: myzod.string(),
		text: myzod.string(),
		sharing_text: myzod.string().optional(),
		sharing_image: myzod.string().optional(),
		cut: myzod.string(),
		topics: myzod
			.array(
				myzod.object({
					id: myzod.number(),
					uri: myzod.string().optional(),
					name: myzod.string(),
				}),
			)
			.nullable()
			.optional(),
	},
	{ allowUnknown: true },
)

export const articlesSchema = myzod.object(
	{
		articles: myzod.array(
			myzod.object(
				{
					id: myzod.number(),
					uri: myzod.string(),
					published_at: myzod.string(),
					title: myzod.string(),
					cut: myzod.string(),
					sharing_text: myzod.string().optional(),
					sharing_image: myzod.string().optional(),
				},
				{ allowUnknown: true },
			),
		),
	},
	{ allowUnknown: true },
)
