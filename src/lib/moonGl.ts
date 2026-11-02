// 用 WebGL 把月面展开图投影到球面：逐像素求球面法线 → 经纬度采样贴图 → 左上光源漫反射 + 临边昏暗。
// 不依赖任何 3D 库；初始化失败（不支持 WebGL、贴图加载失败）时返回 null，由调用方保留 CSS 版本

const VERT = `
attribute vec2 a_pos;
varying vec2 v_uv;
void main() {
	v_uv = a_pos;
	gl_Position = vec4(a_pos, 0.0, 1.0);
}`;

const FRAG = `
precision highp float;
varying vec2 v_uv;
uniform sampler2D u_tex;
uniform float u_rot;
uniform float u_px;
uniform vec3 u_tint;
uniform float u_lo;
uniform float u_hi;
uniform float u_ambient;
uniform float u_limb;
const float PI = 3.14159265;

void main() {
	float r = length(v_uv);
	// 边缘按 1~2 个像素做抗锯齿
	float alpha = 1.0 - smoothstep(1.0 - 1.5 * u_px, 1.0, r);
	if (alpha <= 0.0) discard;

	vec3 n = vec3(v_uv, sqrt(max(0.0, 1.0 - r * r)));
	float lon = atan(n.x, n.z) + u_rot;
	float lat = asin(clamp(n.y, -1.0, 1.0));
	vec2 uv = vec2(fract(lon / (2.0 * PI) + 0.5), 0.5 - lat / PI);

	vec3 tex = texture2D(u_tex, uv).rgb;
	// 先把贴图亮度拉伸到 0~1，再映射进主题给定的区间：亮色主题压在偏亮的一段，避免月海发黑
	float lum = dot(tex, vec3(0.299, 0.587, 0.114));
	lum = clamp((lum - 0.12) / 0.72, 0.0, 1.0);
	vec3 albedo = mix(u_lo, u_hi, lum) * u_tint;

	// 光从左上前方打来；晨昏线用 smoothstep 柔化，月面没有大气，过渡本应很窄，这里略放宽更耐看
	vec3 light = normalize(vec3(-0.5, 0.42, 0.75));
	float diffuse = smoothstep(-0.12, 0.65, dot(n, light));
	float limb = 1.0 - u_limb + u_limb * n.z;
	vec3 color = albedo * mix(u_ambient, 1.0, diffuse) * limb;

	gl_FragColor = vec4(color * alpha, alpha);
}`;

// lo / hi：月面亮度映射区间；ambient：背光面保留的亮度；limb：边缘压暗幅度
export type MoonTone = { tint: [number, number, number]; lo: number; hi: number; ambient: number; limb: number };

// 亮色主题像「宣纸上的淡墨」：整体偏亮偏暖、背光面只是略灰，不能在浅底上显得发黑；暗色主题月球在夜色里依然是亮的
export const moonTones: Record<'light' | 'dark', MoonTone> = {
	light: { tint: [1, 0.958, 0.895], lo: 0.6, hi: 0.94, ambient: 0.68, limb: 0.12 },
	dark: { tint: [1, 0.975, 0.94], lo: 0.42, hi: 0.98, ambient: 0.16, limb: 0.18 },
};

export type MoonRenderer = {
	draw: (rotation: number) => void;
	setTone: (tone: MoonTone) => void;
	resize: () => void;
};

// decode() 在主线程外完成解码，上传纹理时不再同步解码整张贴图
const loadImage = async (src: string) => {
	const img = new Image();
	img.src = src;
	await img.decode();
	return img;
};

// 让出主线程，把初始化拆成多个短任务，避免一个长任务卡住首屏交互
const yieldToMain = () => new Promise<void>((resolve) => setTimeout(resolve, 0));

export async function createMoonRenderer(canvas: HTMLCanvasElement, textureSrc: string, tone: MoonTone) {
	const gl = canvas.getContext('webgl', { premultipliedAlpha: true, antialias: false });
	if (!gl) return null;

	// 贴图下载与解码和着色器编译并行进行
	const imageReady = loadImage(textureSrc);
	// 着色器失败提前返回时不再等待贴图，避免未处理的拒绝
	imageReady.catch(() => undefined);

	const compile = (type: number, source: string) => {
		const shader = gl.createShader(type)!;
		gl.shaderSource(shader, source);
		gl.compileShader(shader);
		return shader;
	};
	const vs = compile(gl.VERTEX_SHADER, VERT);
	const fs = compile(gl.FRAGMENT_SHADER, FRAG);
	const program = gl.createProgram()!;
	gl.attachShader(program, vs);
	gl.attachShader(program, fs);
	gl.linkProgram(program);

	// 查询编译状态会强制同步等待编译完成；支持并行编译扩展时先轮询完成标志，期间不占主线程
	const parallel = gl.getExtension('KHR_parallel_shader_compile');
	if (parallel) {
		while (!gl.getProgramParameter(program, parallel.COMPLETION_STATUS_KHR)) {
			await new Promise((resolve) => requestAnimationFrame(resolve));
		}
	} else {
		await yieldToMain();
	}
	if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
		console.warn('[moon] 着色器编译或链接失败：', gl.getShaderInfoLog(vs), gl.getShaderInfoLog(fs), gl.getProgramInfoLog(program));
		return null;
	}
	gl.useProgram(program);

	const buffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
	const pos = gl.getAttribLocation(program, 'a_pos');
	gl.enableVertexAttribArray(pos);
	gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

	let image: HTMLImageElement;
	try {
		image = await imageReady;
	} catch {
		console.warn('[moon] 月面贴图加载失败，保留 CSS 版本');
		return null;
	}
	// 贴图宽高不是 2 的幂，WebGL1 下只能用 CLAMP + 不生成 mipmap；经度循环在着色器里用 fract 处理
	const texture = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	await yieldToMain();

	const loc = (name: string) => gl.getUniformLocation(program, name);
	const u = {
		rot: loc('u_rot'),
		px: loc('u_px'),
		tint: loc('u_tint'),
		lo: loc('u_lo'),
		hi: loc('u_hi'),
		ambient: loc('u_ambient'),
		limb: loc('u_limb'),
	};

	const setTone = (next: MoonTone) => {
		gl.uniform3fv(u.tint, next.tint);
		gl.uniform1f(u.lo, next.lo);
		gl.uniform1f(u.hi, next.hi);
		gl.uniform1f(u.ambient, next.ambient);
		gl.uniform1f(u.limb, next.limb);
	};

	// 像素比上限 2，高分屏足够清晰，也避免 3x 屏上片元数量翻倍
	const resize = () => {
		const dpr = Math.min(window.devicePixelRatio || 1, 2);
		const size = Math.max(1, Math.round(canvas.clientWidth * dpr));
		if (canvas.width !== size) {
			canvas.width = canvas.height = size;
			gl.viewport(0, 0, size, size);
		}
		gl.uniform1f(u.px, 2 / size);
	};

	const draw = (rotation: number) => {
		gl.uniform1f(u.rot, rotation);
		gl.clearColor(0, 0, 0, 0);
		gl.clear(gl.COLOR_BUFFER_BIT);
		gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
	};

	setTone(tone);
	resize();
	return { draw, setTone, resize } satisfies MoonRenderer;
}
