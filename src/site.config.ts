// 网站名称须与 ICP 备案填写的名称一致
export const site = {
	name: '月兔小筑',
	nameEn: 'Usagi Lodge',
	author: 'Eliauk',
	role: '前端 / 全栈工程师',
	description: 'Eliauk 的个人主页：作品、开源项目与技术随笔。',
	url: 'https://aiusagi.com',
	since: 2022,
	github: 'https://github.com/EliaukRender',
	githubUser: 'EliaukRender',
	sourceRepo: 'eliauk-usagi-blog',
	// 备案号拿到后填写，留空则不显示
	record: {
		icp: '',
		police: '',
		policeCode: '',
	},
} as const;

export const nav = [
	{ no: '01', label: '作品', href: '/projects' },
	{ no: '02', label: '开源', href: '/#open-source' },
	{ no: '03', label: '随笔', href: '/posts' },
	{ no: '04', label: '关于', href: '/about' },
] as const;

export type Repo = {
	name: string;
	desc: string;
	lang: string;
	tags: string[];
};

// 公开仓库，按展示顺序排列
export const repos: Repo[] = [
	{
		name: 'eliauk-music-tauri-rust',
		desc: '用 Tauri 2 + Rust 重构的桌面音乐播放器，体积更小、原生能力更完整。',
		lang: 'TypeScript',
		tags: ['Tauri', 'Rust', 'Vue 3'],
	},
	{
		name: 'eliauk-usagi-blog',
		desc: '就是你正在看的这个站点：Astro + Tailwind CSS v4 的静态个人主页。',
		lang: 'Astro',
		tags: ['Astro', 'Tailwind'],
	},
	{
		name: 'music-electron-react',
		desc: '基于 Electron + React 的仿 QQ 音乐桌面应用，播放器的第一版。',
		lang: 'TypeScript',
		tags: ['Electron', 'React'],
	},
	{
		name: 'eliauk-render-monorepo',
		desc: '基于 monorepo 与 Turborepo 的多应用工程：通用组件库 + 趣味应用。',
		lang: 'TypeScript',
		tags: ['Turborepo', 'Monorepo'],
	},
	{
		name: 'eliauk-agent-dev-knowledge',
		desc: 'Agent 开发相关的学习笔记与知识整理。',
		lang: 'Markdown',
		tags: ['Notes'],
	},
	{
		name: 'vue3-ts-template',
		desc: 'Vue 3 + TypeScript 简约项目模板，开箱即用。',
		lang: 'TypeScript',
		tags: ['Vue 3', 'Template'],
	},
	{
		name: 'eliauk-manage-web',
		desc: 'Vite + Vue 3 + Pinia + Element Plus 的后台管理简约模板。',
		lang: 'TypeScript',
		tags: ['Vue 3', 'Element Plus'],
	},
	{
		name: 'office-electron-vue',
		desc: '基于 Electron + Vue 的桌面应用练习项目。',
		lang: 'HTML',
		tags: ['Electron', 'Vue'],
	},
	{
		name: 'eliauk-blog-web',
		desc: '旧版个人主页：React + Redux + Ant Design + Framer Motion。',
		lang: 'JavaScript',
		tags: ['React', 'Framer Motion'],
	},
];

export const repoUrl = (name: string) => `${site.github}/${name}`;
