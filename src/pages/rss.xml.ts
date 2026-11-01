import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';
import { site } from '@/site.config';

export async function GET(context: APIContext) {
	const posts = await getCollection('posts', ({ data }) => !data.draft);
	return rss({
		title: site.name,
		description: site.description,
		site: context.site ?? site.url,
		items: posts
			.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf())
			.map((post) => ({
				title: post.data.title,
				description: post.data.description,
				pubDate: post.data.date,
				link: `/posts/${post.id}/`,
			})),
	});
}
