# Node 版本

- 16

# github

- https://github.com/sushiswap/sushiswap-interface

# vercel

- Next.js gives you the best developer experience with all the features you need for production: hybrid static & server rendering, TypeScript support, smart bundling, route pre-fetching, and more. No config needed.
- https://nextjs.org/docs/getting-started

# 多语言相关

- Tutorial - Internationalization of React apps
- https://lingui.js.org/tutorials/react.html
- The complete guide to internationalization in Next.js
- https://blog.logrocket.com/complete-guide-internationalization-nextjs/

# husky

- Modern native git hooks made easy
- https://typicode.github.io/husky/#/

# redux-persist

- Persist and rehydrate a redux store.
- https://github.com/rt2zz/redux-persist

# react-ga

- This is a JavaScript module that can be used to include Google Analytics tracking code in a website or app that uses React for its front-end codebase.
- https://github.com/react-ga/react-ga

# lottie-react

- 动画库，用 json 文件来存储动画文件
- https://lottiereact.com/

# commitlint

- 用于 commit 的时候做语法检测
- https://github.com/conventional-changelog/commitlint/#what-is-commitlint

# tailwind

- 原子类 UI 框架
- https://tailwindcss.com/docs/installation
- https://www.tailwind-kit.com/

# headlessui

- 小型的 UI 组件框架
- https://headlessui.dev/react/menu

# heroicons

- icon
- https://heroicons.com/

# visx

- visx a collection of expressive, low-level visualization primitives for React
- https://airbnb.io/visx/

# tailwindshades

- 可以动态生成不同色差的颜色表
- https://www.tailwindshades.com/

# SWR

- 用 hooks 的方式调用 http 请求
- 官网 https://swr.vercel.app/zh-CN
- 调用参数 https://swr.vercel.app/docs/arguments

# env 设定

- 新建一个.env 文件
- 内容：NEXT_PUBLIC_WEB_API_DOMAIN=https://test.daidai.io

# 文件目录说明

- animation 存放 lottie 的动画 json
- components 公用组件
- config 配置文件
- constants 合约相关
- entities 实体?
- enums 各种枚举定义
- features 每个 pages 对应的组件
- functions 工具函数
- guards 只有一个网络守卫
- hooks react hooks
- layouts 布局类
- lib 公用函数?
- modals 公用模态框
- pages 页面
- apis next 的后台 api 定义，不过通常后台 api 不在这里定义
- services 一些网络服务
- state redex
- styles 样式
- types ??

# 写样式时需要用到的网站链接

- https://daisyui.com/
- https://tailwindcss.com/
- https://tailwindcomponents.com/cheatsheet/
- https://headlessui.dev/
- https://heroicons.com/

# 样式规范（和 theme 相关）

- https://daisyui.com/docs/colors/
- 需要根据这个颜色定义进行样式编写
- 尽量不要写和具体颜色相关的 class，比如 bg-red，要写和 semantic 相关的，如 bg-error
- 现在可选用的 theme，参考如下链接：
- https://daisyui.com/docs/themes/

# 移动端头部 meta 大全

```
<!DOCTYPE html> <!-- 使用 HTML5 doctype，不区分大小写 -->
<html lang="zh-cmn-Hans"> <!-- 更加标准的 lang 属性写法 http://zhi.hu/XyIa -->
<head>
    <!-- 声明文档使用的字符编码 -->
    <meta charset='utf-8'>
    <!-- 优先使用 IE 最新版本和 Chrome -->
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1"/>
    <!-- 页面描述 -->
    <meta name="description" content="不超过150个字符"/>
    <!-- 页面关键词 -->
    <meta name="keywords" content=""/>
    <!-- 网页作者 -->
    <meta name="author" content="name, email@gmail.com"/>
    <!-- 搜索引擎抓取 -->
    <meta name="robots" content="index,follow"/>
    <!-- 为移动设备添加 viewport -->
    <meta name="viewport" content="initial-scale=1, maximum-scale=3, minimum-scale=1, user-scalable=no">
    <!-- `width=device-width` 会导致 iPhone 5 添加到主屏后以 WebApp 全屏模式打开页面时出现黑边 http://bigc.at/ios-webapp-viewport-meta.orz -->

    <!-- iOS 设备 begin -->
    <meta name="apple-mobile-web-app-title" content="标题">
    <!-- 添加到主屏后的标题（iOS 6 新增） -->
    <meta name="apple-mobile-web-app-capable" content="yes"/>
    <!-- 是否启用 WebApp 全屏模式，删除苹果默认的工具栏和菜单栏 -->

    <meta name="apple-itunes-app" content="app-id=myAppStoreID, affiliate-data=myAffiliateData, app-argument=myURL">
    <!-- 添加智能 App 广告条 Smart App Banner（iOS 6+ Safari） -->
    <meta name="apple-mobile-web-app-status-bar-style" content="black"/>
    <!-- 设置苹果工具栏颜色 -->
    <meta name="format-detection" content="telphone=no, email=no"/>
    <!-- 忽略页面中的数字识别为电话，忽略email识别 -->
    <!-- 启用360浏览器的极速模式(webkit) -->
    <meta name="renderer" content="webkit">
    <!-- 避免IE使用兼容模式 -->
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <!-- 针对手持设备优化，主要是针对一些老的不识别viewport的浏览器，比如黑莓 -->
    <meta name="HandheldFriendly" content="true">
    <!-- 微软的老式浏览器 -->
    <meta name="MobileOptimized" content="320">
    <!-- uc强制竖屏 -->
    <meta name="screen-orientation" content="portrait">
    <!-- QQ强制竖屏 -->
    <meta name="x5-orientation" content="portrait">
    <!-- UC强制全屏 -->
    <meta name="full-screen" content="yes">
    <!-- QQ强制全屏 -->
    <meta name="x5-fullscreen" content="true">
    <!-- UC应用模式 -->
    <meta name="browsermode" content="application">
    <!-- QQ应用模式 -->
    <meta name="x5-page-mode" content="app">
    <!-- windows phone 点击无高光 -->
    <meta name="msapplication-tap-highlight" content="no">
    <!-- iOS 图标 begin -->
    <link rel="apple-touch-icon-precomposed" href="/apple-touch-icon-57x57-precomposed.png"/>
    <!-- iPhone 和 iTouch，默认 57x57 像素，必须有 -->
    <link rel="apple-touch-icon-precomposed" sizes="114x114" href="/apple-touch-icon-114x114-precomposed.png"/>
    <!-- Retina iPhone 和 Retina iTouch，114x114 像素，可以没有，但推荐有 -->
    <link rel="apple-touch-icon-precomposed" sizes="144x144" href="/apple-touch-icon-144x144-precomposed.png"/>
    <!-- Retina iPad，144x144 像素，可以没有，但推荐有 -->
    <!-- iOS 图标 end -->

    <!-- iOS 启动画面 begin -->
    <link rel="apple-touch-startup-image" sizes="768x1004" href="/splash-screen-768x1004.png"/>
    <!-- iPad 竖屏 768 x 1004（标准分辨率） -->
    <link rel="apple-touch-startup-image" sizes="1536x2008" href="/splash-screen-1536x2008.png"/>
    <!-- iPad 竖屏 1536x2008（Retina） -->
    <link rel="apple-touch-startup-image" sizes="1024x748" href="/Default-Portrait-1024x748.png"/>
    <!-- iPad 横屏 1024x748（标准分辨率） -->
    <link rel="apple-touch-startup-image" sizes="2048x1496" href="/splash-screen-2048x1496.png"/>
    <!-- iPad 横屏 2048x1496（Retina） -->

    <link rel="apple-touch-startup-image" href="/splash-screen-320x480.png"/>
    <!-- iPhone/iPod Touch 竖屏 320x480 (标准分辨率) -->
    <link rel="apple-touch-startup-image" sizes="640x960" href="/splash-screen-640x960.png"/>
    <!-- iPhone/iPod Touch 竖屏 640x960 (Retina) -->
    <link rel="apple-touch-startup-image" sizes="640x1136" href="/splash-screen-640x1136.png"/>
    <!-- iPhone 5/iPod Touch 5 竖屏 640x1136 (Retina) -->
    <!-- iOS 启动画面 end -->

    <!-- iOS 设备 end -->
    <meta name="msapplication-TileColor" content="#000"/>
    <!-- Windows 8 磁贴颜色 -->
    <meta name="msapplication-TileImage" content="icon.png"/>
    <!-- Windows 8 磁贴图标 -->

    <link rel="alternate" type="application/rss+xml" title="RSS" href="/rss.xml"/>
    <!-- 添加 RSS 订阅 -->
    <link rel="shortcut icon" type="image/ico" href="/favicon.ico"/>
    <!-- 添加 favicon icon -->

    <title>标题</title>
</head>
```

# 执行指令

- yarn install ->安装
- yarn dev ->开发模式
- yarn build ->打包

# git base 仓库和源仓库管理

```bash
# clone base仓库
git clone <base-remote-url>
 - 这一步因为clone会复制仓库的文件名，所以要先把frontend的目录rename，clone了之后在改回项目的名字，比如daidaiio

# 修改base仓库引用名称
git remote rename origin base

# 添加源仓库
git remote add origin <remote-url>

# push base仓库内容到源仓库
git push -u origin main

# 拉取base仓库的main分支数据到本地
git fetch base main

# 合并base仓库数据到源仓库
git merge base/main

# 解决冲突
# 正常提交代码

# 后面重复以下操作
# 拉取base仓库的main分支数据到本地
git fetch base main

# 合并base仓库数据到源仓库
git merge base/main

# 解决冲突
# 正常提交代码
```

# commit 的时候因为 lingui 导致无法 merge 的时候

- git commit -m "..." --no-verify
