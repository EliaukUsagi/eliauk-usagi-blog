import { readFile } from 'node:fs/promises';
import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';
import sharp from 'sharp';
import { site } from '@/site.config';
import { ogPalette } from '@/lib/theme';

// 构建时为每篇随笔 / 作品生成 1200×630 分享图。文字由 sharp（librsvg + fontconfig）用系统字体渲染，
// 构建机需装有中文字体（如 Noto Sans CJK SC），否则标题会显示为方框
const W = 1200;
const H = 630;
const FONT = `'PingFang SC', 'Noto Sans CJK SC', 'Noto Sans SC', 'Source Han Sans SC', 'Microsoft YaHei', sans-serif`;

type Card = { kicker: string; title: string; desc: string };

export const getStaticPaths = (async () => {
	const posts = await getCollection('posts', ({ data }) => !data.draft);
	const projects = await getCollection('projects');
	return [
		{ params: { path: 'default' }, props: { kicker: site.nameEn, title: site.name, desc: site.description } },
		...posts.map((post) => ({
			params: { path: `posts/${post.id}` },
			props: { kicker: `随笔 · ${post.data.category}`, title: post.data.title, desc: post.data.description },
		})),
		...projects.map((project) => ({
			params: { path: `projects/${project.id}` },
			props: { kicker: `作品 · ${project.data.year}`, title: project.data.title, desc: project.data.subtitle },
		})),
	];
}) satisfies GetStaticPaths;

const escape = (text: string) =>
	text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// 按视觉宽度折行：中文记 1，西文约半个字宽；西文单词不拆开，句读不落在行首；超出行数时末行加省略号
const CLOSING = /^[，。、：；！？）」』》,.:;!?)]$/;

function wrap(text: string, perLine: number, maxLines: number) {
	const tokens = text.match(/[A-Za-z0-9.+#-]+|\s+|./gu) ?? [];
	const widthOf = (token: string) => [...token].reduce((n, c) => n + (/[\u0000-\u00ff]/.test(c) ? 0.55 : 1), 0);
	const lines: string[] = [];
	let line = '';
	let width = 0;
	for (const token of tokens) {
		const w = widthOf(token);
		if (width + w > perLine && line && !CLOSING.test(token)) {
			lines.push(line.trimEnd());
			line = '';
			width = 0;
			if (!token.trim()) continue;
		}
		line += token;
		width += w;
	}
	if (line) lines.push(line.trimEnd());
	if (lines.length > maxLines) {
		lines.length = maxLines;
		lines[maxLines - 1] = `${lines[maxLines - 1].slice(0, -1)}…`;
	}
	return lines;
}

export const GET: APIRoute = async ({ props }) => {
	const { kicker, title, desc } = props as Card;
	const titleLines = wrap(title, 11, 3);
	const descLines = wrap(desc, 28, 2);
	const titleSize = 68;
	const titleTop = 230;
	const descTop = titleTop + titleLines.length * titleSize * 1.2 + 24;

	const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
	<defs>
		<radialGradient id="moon" cx="38%" cy="30%" r="75%">
			<stop offset="0" stop-color="${ogPalette.moonHi}"/>
			<stop offset="0.55" stop-color="${ogPalette.moonBase}"/>
			<stop offset="1" stop-color="${ogPalette.moonEdge}"/>
		</radialGradient>
		<pattern id="grid" width="72" height="72" patternUnits="userSpaceOnUse">
			<path d="M72 0H0V72" fill="none" stroke="${ogPalette.fg}" stroke-opacity="0.05"/>
		</pattern>
	</defs>
	<rect width="${W}" height="${H}" fill="${ogPalette.canvas}"/>
	<rect width="${W}" height="${H}" fill="url(#grid)"/>
	<circle cx="1010" cy="150" r="230" fill="url(#moon)"/>
	<circle cx="1010" cy="150" r="300" fill="none" stroke="${ogPalette.fg}" stroke-opacity="0.08"/>
	<circle cx="96" cy="104" r="6" fill="${ogPalette.accent}"/>
	<text x="116" y="112" font-family="${FONT}" font-size="24" fill="${ogPalette.mute}" letter-spacing="1">${escape(kicker)}</text>
	${titleLines
		.map(
			(text, i) =>
				`<text x="88" y="${titleTop + i * titleSize * 1.2}" font-family="${FONT}" font-size="${titleSize}" font-weight="600" fill="${ogPalette.fg}">${escape(text)}</text>`,
		)
		.join('')}
	${descLines
		.map(
			(text, i) =>
				`<text x="88" y="${descTop + i * 44}" font-family="${FONT}" font-size="28" fill="${ogPalette.mute}">${escape(text)}</text>`,
		)
		.join('')}
	<text x="88" y="566" xml:space="preserve" font-family="${FONT}" font-size="22" fill="${ogPalette.soft}">${escape(site.name)}<tspan fill="${ogPalette.faint}">  ·  ${escape(new URL(site.url).host)}</tspan></text>
</svg>`;

	const mascot = await sharp(await readFile('src/assets/brand/usagi-mascot.svg'), { density: 600 })
		.resize({ height: 230 })
		.png()
		.toBuffer();

	const png = await sharp(Buffer.from(svg))
		.composite([{ input: mascot, left: 920, top: 360 }])
		.png()
		.toBuffer();

	return new Response(new Uint8Array(png), { headers: { 'Content-Type': 'image/png' } });
};
