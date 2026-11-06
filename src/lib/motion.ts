// JS 驱动的动画与 CSS 的 --ease-out-expo / --dur-* 共用同一套节奏
export const easeOutExpoBezier = [0.16, 1, 0.3, 1] as const;
export const easeOutExpo = `cubic-bezier(${easeOutExpoBezier.join(', ')})`;

// 主题切换用对称缓动，洇开与收拢的节奏一致；ThemeToggle 需要控制点求时间反函数
export const easeInOutBezier = [0.65, 0, 0.35, 1] as const;
export const easeInOut = `cubic-bezier(${easeInOutBezier.join(', ')})`;

export const dur = {
	fast: 200,
	hover: 250,
	base: 300,
	slow: 500,
	slower: 800,
	reveal: 1000,
	page: 600,
	carousel: 900,
	theme: 700,
} as const;
