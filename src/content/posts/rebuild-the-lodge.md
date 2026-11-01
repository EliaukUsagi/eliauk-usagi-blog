---
title: 重建小筑：为什么用 Astro 写个人主页
description: 旧主页是一个 React 单页应用，这次换成 Astro 静态站点，记录一下取舍。
date: 2026-11-01
tags: [Astro, 个人主页, 工程化]
---

旧版主页是一个 React + Redux + Ant Design 的单页应用，首屏要加载完整的 JS 才能看到内容，还依赖一个早已下线的后端。这次重写，我给自己定了三个目标：

1. **内容优先**：文章和作品都是 Markdown，写完即发布，不需要后台。
2. **足够快**：页面默认是纯静态 HTML，只有真正需要交互的地方才加载脚本。
3. **好维护**：新增一个作品，只需要写一个 Markdown 文件、丢一个截图文件夹。

## 为什么是 Astro

Astro 的「群岛架构」默认不向浏览器发送任何框架运行时，这对以阅读为主的个人站点再合适不过。内容集合（Content Collections）配合 Zod 校验 frontmatter，写错字段会在构建期直接报错。

```ts
const projects = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
	schema: z.object({ title: z.string(), order: z.number() }),
});
```

## 截图怎么管理

每个作品对应 `src/assets/projects/<作品>/` 目录，子目录就是分组，文件名就是图注，`01-` 这样的前缀只用来排序。构建时 Astro 会把截图压缩成多种尺寸的 WebP，按屏幕宽度按需加载。

## 视觉

整体走深色、编辑感的路线：衬线字体做标题，等宽字体做标注，配一只住在月亮上的兔子。它也是我知识库项目的吉祥物。
