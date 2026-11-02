// 网站名称须与 ICP 备案填写的名称一致
export const site = {
	name: '月兔小筑',
	nameEn: 'Usagi Lodge',
	author: 'EliaukUsagi',
	role: 'AI 应用全栈工程师',
	description: 'EliaukUsagi 的个人主页：做过的项目、开源仓库，以及学习路上的笔记。',
	url: 'https://aiusagi.com',
	since: 2022,
	github: 'https://github.com/EliaukUsagi',
	githubUser: 'EliaukUsagi',
	// 联系邮箱，留空则关于页与页脚不显示邮件入口
	email: 'chang_sowing@163.com' as string,
	// 备案号拿到后填写，留空则不显示
	record: {
		icp: '',
		police: '',
		policeCode: '',
	},
} as const;

export const nav = [
	{ label: '作品', href: '/projects' },
	{ label: '随笔', href: '/posts' },
	{ label: '关于', href: '/about' },
] as const;

export type Repo = { name: string; desc: string };

// 没有对应作品的公开仓库，展示在作品页底部；作品自身的仓库在作品卡与详情页里提供入口
export const repos: Repo[] = [
	{ name: 'vue3-ts-template', desc: 'Vue 3 + TypeScript 简约项目模板，开箱即用。' },
	{ name: 'eliauk-manage-web', desc: 'Vite + Vue 3 + Pinia + Element Plus 的后台管理简约模板。' },
	{ name: 'eliauk-blog-web', desc: '旧版个人主页：React + Redux + Ant Design + Framer Motion。' },
];

export const repoUrl = (name: string) => `${site.github}/${name}`;
