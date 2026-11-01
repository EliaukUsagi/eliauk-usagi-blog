---
title: Eliauk 音乐 · 第二版
subtitle: Tauri 2 + Rust 重构的桌面音乐播放器
summary: 第一版 Electron 播放器的重写。界面层继续用 Web 技术，系统交互交给 Rust：安装包更小、内存占用更低，也补上了全屏歌词、频谱可视化、mini 播放器和系统媒体中心等桌面能力，支持 Windows 与 macOS。
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

## 为什么重写

第一版用 Electron 跑通了功能，但安装包大、内存占用高，托盘、全局快捷键、系统媒体控制这些能力也要绕不少路。正好想系统地学一次 Rust，就决定用 Tauri 2 重写。

## 实现要点

- **进程模型**：界面、Rust 核心与本地数据服务分离。数据服务随应用启动和退出，也可以切换为连接远程服务，两种形态共用一套前端。
- **桌面能力走原生**：右键菜单、托盘、全局快捷键、Windows SMTC 与 macOS「正在播放」都通过 Tauri 插件或 Rust 实现，而不是在 Web 层模拟。
- **频谱**：按对数频段聚合并补偿高频，让鼓点和人声区更明显；柱子快升慢降，暂停时先落回底部再停止，避免画面突然清空。

## 学到的

这是第一次在完整项目里写 Rust。所有权、异步运行时和 Tauri 的进程间通信，都是边读文档边踩坑弄明白的。也养成了一些习惯：Rust 侧用 clippy、fmt 和单文件行数检查约束代码，前端用 ESLint + Vitest，每个版本的改动都记在更新日志里。

> 开源学习项目，安装包发布在 GitHub Releases。音乐数据来自第三方开源接口，仅供学习交流使用。
