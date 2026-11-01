import type { CollectionEntry } from 'astro:content';

export const categories = ['AI', '工程', '体验', '随想'] as const;
export type Category = (typeof categories)[number];

export const categoryHint: Record<Category, string> = {
	AI: '大模型应用与 AI 协作',
	工程: '架构、工具链与取舍',
	体验: '交互细节与产品手感',
	随想: '代码之外',
};

// 中文按字、英文按词估算，约每分钟 300 字
export function readingMinutes(body = '') {
	const text = body.replace(/```[\s\S]*?```/g, '').replace(/[#>*`\-[\]()!]/g, '');
	const cjk = text.match(/[一-鿿]/g)?.length ?? 0;
	const words = text.replace(/[一-鿿]/g, ' ').match(/[A-Za-z0-9]+/g)?.length ?? 0;
	return Math.max(1, Math.ceil((cjk + words * 1.5) / 300));
}

export const sortByDate = (a: CollectionEntry<'posts'>, b: CollectionEntry<'posts'>) =>
	b.data.date.valueOf() - a.data.date.valueOf();
