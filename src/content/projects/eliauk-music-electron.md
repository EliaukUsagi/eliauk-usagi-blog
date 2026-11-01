---
title: Eliauk 音乐 · 第一版
subtitle: Electron + React 仿 QQ 音乐桌面应用
summary: 播放器的起点。用 Electron + React 实现了一个仿 QQ 音乐的桌面应用，完成了播放控制、歌单管理、歌词与可自定义的频谱图，也是后来用 Tauri 重构的原型。
shots: eliauk-music-electron
order: 3
year: '2024'
status: 已归档
stack: [Electron, React, TypeScript, Redux, Sass, Webpack]
repo: https://github.com/EliaukRender/music-electron-react
series: eliauk-music
highlights:
  - 播放、暂停、切歌、快进快退、循环模式、音量调节、双击切歌
  - 新建歌单、添加歌曲、删除歌单
  - 频谱图颜色与形状可自定义
  - 自绘窗口：最大化、最小化、全屏，双击标题栏切换
---

## 回顾

这是我第一个完整的桌面应用。它让我真正理解了主进程与渲染进程的分工、IPC 通信，以及音频可视化背后的 Web Audio API。

它的不足也很明显：安装包体积大，部分桌面能力需要较多胶水代码。这些问题最终促成了[第二版的重构](/projects/eliauk-music-tauri)。
