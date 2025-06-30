# 项目简介

本项目是一个基于Next.js构建的多功能Web应用，集成了AI聊天功能、课程仓库展示以及QAnything AI工具。项目采用现代化的UI设计，提供直观的用户界面和流畅的交互体验。主要功能包括：

- 首页展示课程作品
- AI聊天功能，支持与QAnything模型交互
- 课程仓库，提供学习资源搜索
- QAnything AI工具集成
- WakaTime编码时间统计

项目截图如下：
首页（旧作业1）

![image-20250628215837837](./doc/image-20250628215837837.png)

课程仓库（旧作业2）

![image-20250628220518235](./doc/image-20250628220518235.png)

AI聊天（QAnthing API）

![image-20250628215928600](./doc/image-20250628215928600.png)

![image-20250628220402520](./doc/image-20250628220402520.png)

QAnything（iframe嵌入版）

![image-20250628220613464](./doc/image-20250628220613464.png)

# QAnything集成路径与实现细节

## 集成路径

1. **前端页面集成**：通过独立路由页面实现QAnything工具的嵌入
2. **API代理层**：构建后端API路由处理与QAnything服务的通信
3. **前端交互界面**：实现聊天界面与设置面板

## 实现细节

### 1. 页面嵌入实现

QAnything工具通过iframe方式嵌入到应用中，对应页面为`src/app/qanything/page.js`：

```jsx
export default function QAnythingPage() {
  return (
    <div style={{ width: '100%', height: '100%', minHeight: 'calc(100vh - 4rem)', margin: 0, padding: 0 }}>
      <iframe
        src="https://ai.youdao.com/saas/qanything"
        width="100%"
        height="100%"
        frameBorder="0"
        title="QAnything AI Tool"
        style={{ border: 'none' }}
      />
    </div>
  );
}
```

### 2. API代理实现

项目通过API路由`src/app/api/chat/route.js`实现与QAnything后端服务的通信代理：

- 接收前端请求并验证API Key
- 格式化请求参数（maxToken、hybridSearch、networking等）
- 转发请求到有道API：`https://openapi.youdao.com/q_anything/api/chat_stream`
- 处理流式响应并返回给前端

关键代码片段：

```javascript
// 代理请求到有道API
const response = await fetch('https://openapi.youdao.com/q_anything/api/chat_stream', {
  method: 'POST',
  headers: {
    'Authorization': apiKey,
    'Content-Type': 'application/json',
    'Accept': 'text/event-stream',
  },
  body: JSON.stringify(formattedData),
});
```

### 3. 聊天界面实现

聊天界面位于`src/app/chat/page.js`，提供以下功能：

- 消息展示区域
- 输入框与发送功能
- 设置面板（API Key、模型选择、参数配置等）
- 支持流式响应展示

# WakaTime API集成方法

## 集成架构

1. **后端API路由**：`src/app/api/wakatime/route.js`
2. **前端展示组件**：`src/app/footer/page.js`

## 实现步骤

### 1. 环境变量配置

在项目根目录创建`.env.local`文件，添加WakaTime API Key：

```
# WAKATIME_API
NEXT_PUBLIC_API_KEY=your_api_key_here
NEXT_PUBLIC_KB_IDS=your_api_key_here #多个用,分割
# WakaTime API Key
WAKATIME_API_KEY=your_api_key_here
```

### 2. 后端API实现

创建API路由处理WakaTime数据请求：

```javascript
// src/app/api/wakatime/route.js
import { NextResponse } from 'next/server';

export async function GET() {
  const apiKey = process.env.WAKATIME_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: 'WAKATIME_API_KEY environment variable not set' },
      { status: 500 }
    );
  }

  try {
    const response = await fetch(
      'https://wakatime.com/api/v1/users/current/stats/last_7_days',
      { headers: { Authorization: `Basic ${Buffer.from(`${apiKey}:`).toString('base64')}` } }
    );

    if (!response.ok) throw new Error('Failed to fetch WakaTime data');
    return NextResponse.json(await response.json());
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
```

### 3. 前端集成

在页脚组件中获取并展示WakaTime数据：

```javascript
// src/app/footer/page.js
'use client';

import { useEffect, useState } from 'react';

export default function Footer() {
  const [codingTime, setCodingTime] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWakaTimeData = async () => {
      try {
        const response = await fetch('/api/wakatime');
        if (!response.ok) throw new Error('Failed to fetch data');
        const data = await response.json();
        const totalTime = data.data?.human_readable_total || 'No data';
        setCodingTime(totalTime);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchWakaTimeData();
  }, []);

  // 渲染组件...
}
```

# Next.js项目结构

本项目采用Next.js 13+的App Router架构，主要目录结构如下：

```
nextjs-work/
├── public/              # 静态资源
├── src/app/             # 应用主目录
│   ├── api/             # API路由
│   │   ├── chat/        # QAnything聊天API
│   │   └── wakatime/    # WakaTime API
│   ├── chat/            # 聊天页面
│   ├── course-repo/     # 课程仓库页面
│   ├── qanything/       # QAnything工具页面
│   ├── footer/          # 页脚组件
│   ├── layout.js        # 根布局组件
│   ├── page.js          # 首页
│   └── globals.css      # 全局样式
├── next.config.mjs      # Next.js配置
├── package.json         # 项目依赖
└── tailwind.config.js   # Tailwind CSS配置
```

## 关键文件说明

- **layout.js**: 定义应用的整体布局，包含导航栏和页脚
- **page.js**: 各路由的主页面组件
- **api/**: 包含所有API路由处理函数
- **globals.css**: 全局样式定义，使用Tailwind CSS

## 路由结构

- `/`: 首页
- `/chat`: AI聊天界面
- `/course-repo`: 课程仓库
- `/qanything`: QAnything工具
- `/api/chat`: 聊天API端点
- `/api/wakatime`: WakaTime数据API端点
