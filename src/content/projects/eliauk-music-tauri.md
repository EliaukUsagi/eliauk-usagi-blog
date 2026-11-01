---
title: Eliauk 音乐 · 第二版
subtitle: Tauri 2 + Rust 重构的桌面音乐播放器
summary: 第一版 Electron 播放器的完全重构。用 Tauri 2 + Rust 换来更小的安装包和更低的内存占用，同时补齐全屏歌词、频谱可视化、mini 播放器、系统媒体中心等桌面原生能力，支持 Windows 与 macOS。
shots: eliauk-music-tauri
order: 2
year: '2026'
status: v1.0.0
stack: [Tauri 2, Rust, Vue 3, TypeScript, Vite, Pinia, Naive UI, Tailwind CSS v4]
repo: https://github.com/EliaukRender/eliauk-music-tauri-rust
release: https://github.com/EliaukRender/eliauk-music-tauri-rust/releases
series: eliauk-music
highlights:
  - 播放队列拖拽排序、三种播放模式、播放历史，冷启动恢复队列与进度
  - 全屏歌词逐字高亮、翻译与偏移调节，背景叠加封面主色光斑
  - 柱状、曲线、波形、环形多种频谱样式
  - mini 播放器窗口、托盘控制、全局快捷键，接入 Windows SMTC 与 macOS 正在播放
  - Rust 与前端双侧分层约束、单元测试与语义化版本管理
---

## 为什么重构

第一版基于 Electron，功能跑通了，但安装包大、内存占用高，很多桌面能力也要绕路实现。第二版换成 Tauri 2：界面层继续用 Web 技术，系统交互交给 Rust，在体积和原生体验之间取得更好的平衡。

## 实现要点

- **进程模型**：界面、Rust 核心与本地数据服务分离，服务随应用启动和退出，也可以切换为连接远程服务。
- **桌面原生**：原生右键菜单、托盘、全局快捷键、系统媒体中心都走 Tauri 插件或 Rust 实现，而不是在 Web 层模拟。
- **工程化**：Rust 侧 clippy + fmt + 单文件行数检查，前端 ESLint + Vitest，提交信息与版本号统一管理。

> 开源学习项目，安装包发布在 GitHub Releases。音乐数据来自第三方开源接口，仅供学习交流使用。
