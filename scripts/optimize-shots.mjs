// 把 src/assets 下的 PNG / JPG 转成 WebP 并删除原图：最长边不超过 2400px，质量 82
import { readdir, rm, stat } from 'node:fs/promises';
import { extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = fileURLToPath(new URL('../src/assets/', import.meta.url));
const MAX_EDGE = 2400;
const QUALITY = 82;

async function* walk(dir) {
	for (const entry of await readdir(dir, { withFileTypes: true })) {
		const path = join(dir, entry.name);
		if (entry.isDirectory()) yield* walk(path);
		else if (/\.(png|jpe?g)$/i.test(entry.name)) yield path;
	}
}

let before = 0;
let after = 0;
for await (const file of walk(ROOT)) {
	const target = file.slice(0, -extname(file).length) + '.webp';
	await sharp(file)
		.resize({ width: MAX_EDGE, height: MAX_EDGE, fit: 'inside', withoutEnlargement: true })
		.webp({ quality: QUALITY, effort: 6 })
		.toFile(target);
	const [src, out] = await Promise.all([stat(file), stat(target)]);
	before += src.size;
	after += out.size;
	await rm(file);
	console.log(`${file.slice(ROOT.length)}  ${(src.size / 1024).toFixed(0)}KB → ${(out.size / 1024).toFixed(0)}KB`);
}

const mb = (n) => (n / 1024 / 1024).toFixed(1);
console.log(before ? `完成：${mb(before)}MB → ${mb(after)}MB` : '没有需要转换的图片');
