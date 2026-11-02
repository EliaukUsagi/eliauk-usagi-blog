# 月兔小筑 · eliauk-usagi-blog

Eliauk 的个人主页（aiusagi.com）：作品、开源项目与技术随笔。

Astro 7 · MDX · Tailwind CSS v4 · 纯静态输出，无后端、无外部 CDN。

## 开发

```bash
pnpm install
pnpm dev        # http://localhost:4321
pnpm check      # 类型与模板检查
pnpm build      # 检查 + 构建到 dist/
pnpm shots      # 把 src/assets 下的 PNG / JPG 转为 WebP 并删除原图
```

需要 Node ≥ 22.22。

## 内容维护

| 要做的事         | 怎么做                                                                               |
| ---------------- | ------------------------------------------------------------------------------------ |
| 新增作品         | 在 `src/content/projects/` 新建 md，字段见 `src/content.config.ts`；`order` 决定排序 |
| 添加作品截图     | 放进 `src/assets/projects/<frontmatter 的 shots>/`，见下文                           |
| 写随笔           | 在 `src/content/posts/` 新建 md / mdx，`draft: true` 不发布                          |
| 其他仓库列表     | `src/site.config.ts` 的 `repos`（作品页底部，只放没有对应作品的仓库）                |
| 网站名称、备案号 | `src/site.config.ts` 的 `name`、`record`                                             |

### 截图规则

```
src/assets/projects/usagi-kb/
├── 01-管理后台/
│   ├── 01-文档治理.png
│   └── 02-检索调试.png
└── 02-查询前台/
    └── 01-首页.png
```

- 子目录是分组，不需要分组时直接把图片放在作品目录下。
- 文件名就是图注，`01-` 前缀只用于排序，展示时会去掉。
- 第一张图作为封面；没有截图时显示占位框。
- 截图统一用 WebP：放入 PNG / JPG 后执行 `pnpm shots` 转换（最长边 2400px，质量 82）。
- 构建时再按 640 / 960 / 1440 输出多尺寸 WebP；首页轮播只有第一张优先加载，其余懒加载。

## 部署

站点由知识库项目（`eliauk-usagi-kb`）的网关托管，与问答服务共用一台服务器：

```bash
USAGI_SERVER=root@8.160.112.6 scripts/release-server.sh
```

脚本要求工作区干净，本机执行 `pnpm build` 后把 `dist/` 同步到服务器的 `/opt/usagi-kb/deploy/blog/site/`，网关只读挂载，无需重启。路由与缓存策略（`/_astro/` 长期缓存、页面不缓存）在知识库仓库的 `deploy/gateway/blog-routes.conf`。

| 入口    | 地址                      | 说明                                                                                                                       |
| ------- | ------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| IP 入口 | `http://8.160.112.6:8082` | 公开访问；ICP 备案通过前使用                                                                                               |
| 正式    | `https://aiusagi.com`     | 备案通过后在知识库的 `deploy/gateway/.env.production` 设置 `USAGI_DOMAIN=aiusagi.com` 并发布网关即启用；`www` 跳转到根域名 |

## 备案相关约定

本站作为 aiusagi.com 首页，需与 ICP 备案的「个人主页」性质一致：

- 不加评论、留言、注册等交互功能。
- 不直接托管安装包等下载资源，下载统一指向 GitHub Releases。
- 不链接到 `kb.` / `admin.` 等内部应用入口。
- 网站名称与备案名称保持一致；拿到备案号后填入 `record`，页脚自动显示。
