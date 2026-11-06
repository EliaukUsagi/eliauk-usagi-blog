// 与 src/styles/global.css 的 :root 色板保持同步；JS / SVG 无法读取 CSS 变量时的唯一来源
export const themeColor = {
	light: '#f5f3ef', // --canvas
	dark: '#121110', // --canvas (dark)
} as const;

// OG 分享图由 sharp/librsvg 独立渲染，取色从这里统一取，避免与页面主题漂移
export const ogPalette = {
	canvas: '#f5f3ef',
	fg: '#1c1a17',
	soft: '#45413b',
	mute: '#6e6961',
	faint: '#8c857a',
	accent: '#a9512f',
	moonHi: '#ffffff',
	moonBase: '#f2ece2',
	moonEdge: '#ddd2c1',
} as const;
