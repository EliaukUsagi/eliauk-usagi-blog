---
title: Eliauk 音乐 · 第一版
subtitle: Electron + React 仿 QQ 音乐桌面应用
summary: 播放器的起点：用 Electron + React 仿照 QQ 音乐做的桌面应用，实现了播放控制、歌单管理、歌词与可自定义的频谱图。很多想法后来在 Tauri 版里重新实现了一遍。
shots: eliauk-music-electron
order: 3
year: '2024'
status: 已归档
stack: [Electron, React, TypeScript, Redux, Sass, Webpack]
repo: https://github.com/EliaukUsagi/music-electron-react
series: eliauk-music
highlights:
  - 播放、暂停、切歌、快进快退、循环模式、音量调节、双击切歌
  - 新建歌单、添加歌曲、删除歌单
  - 频谱图颜色与形状可自定义
  - 自绘窗口：最大化、最小化、全屏，双击标题栏切换
---

## 回顾

这是我的第一个完整桌面应用。做它之前，主进程和渲染进程、IPC 通信、Web Audio API 对我来说都只是概念；做完之后，才算真正弄清楚一个桌面应用是怎么运转的。

现在回头看，代码里有不少可以做得更好的地方：状态管理过于集中，部分桌面能力靠胶水代码拼起来，安装包体积也偏大。这些问题记录下来，成了[第二版](/projects/eliauk-music-tauri)重写时的清单。

仓库保持原样归档，作为一个起点的记录。
