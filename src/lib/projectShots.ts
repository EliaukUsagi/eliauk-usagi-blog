import type { ImageMetadata } from 'astro';

export type Shot = { src: ImageMetadata; caption: string };
export type ShotGroup = { label: string; shots: Shot[] };

const files = import.meta.glob<ImageMetadata>('/src/assets/projects/**/*.{png,jpg,jpeg,webp,avif}', {
	eager: true,
	import: 'default',
});

// 文件与目录名可带 "01-" 前缀控制排序，展示时去掉
const stripOrder = (name: string) => name.replace(/^\d+[-_.\s]*/, '');
const stripExt = (name: string) => name.replace(/\.[^.]+$/, '');

export function getShotGroups(dir: string): ShotGroup[] {
	const prefix = `/src/assets/projects/${dir}/`;
	const groups = new Map<string, Shot[]>();

	for (const path of Object.keys(files).sort((a, b) => a.localeCompare(b, 'zh-CN', { numeric: true }))) {
		if (!path.startsWith(prefix)) continue;
		const parts = path.slice(prefix.length).split('/');
		const group = parts.length > 1 ? parts[0] : '';
		const list = groups.get(group) ?? [];
		list.push({ src: files[path], caption: stripOrder(stripExt(parts[parts.length - 1])) });
		groups.set(group, list);
	}

	return [...groups.entries()].map(([label, shots]) => ({ label: stripOrder(label), shots }));
}

export function getCover(dir: string): Shot | undefined {
	return getShotGroups(dir)[0]?.shots[0];
}
