import myzod from 'myzod'

export const articleSchema = myzod.object(
	{
		id: myzod.number(),
		uri: myzod.string(),
		created_at: myzod.string(),
		title: myzod.string(),
		text: myzod.string(),
		sharing_text: myzod.string().optional(),
		sharing_image: myzod.string().optional(),
		cut: myzod.string(),
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
					created_at: myzod.string(),
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
