# 🐷 的个人网站

## 目录结构介绍

    |-- assest
    |   |-- css                           // 样式表
    |   |-- font                          // 字体库
    |   |-- js
    |   |   |-- skrollr.min.js            // 视觉滚动差插件
    |   |   |-- utils.js                  // 通用函数、方法
    |-- components
    |   |-- articleList                   // 文章列表组件
    |   |-- comment                       // 评论组件
    |   |-- footer                        // 底部组件
    |   |-- header                        // 头部组件
    |   |-- hotArticle                    // 热门文章组件
    |   |-- loading                       // 加载组件
    |   |-- tags                          // 文章标签组件
    |   |-- weather                       // 天气组件
    |-- layouts                           // 默认布局
    |-- middleware
    |-- pages
    |   |-- author                        // 个人页面
    |   |-- blog                          // 博客页面
    |   |-- photos                        // 相册页面
    |-- plugins
    |   |-- axios.js                      // axios 过滤器
    |   |-- directive.js                  // 自定义指令
    |   |-- filters.js                    // vue 过滤器
    |-- static                            // 静态文件
    |-- store                             // Vuex 状态树
    |-- .eslintrc.js                      // eslint 配置文件
    |-- .prettierrc                       // prettierrc 配置文件
    |-- nuxt.config.js                    // nuxt 配置文件
    |-- package.json                      // 项目及工具的依赖配置文件
    |-- README.md                         // 说明

## 构建生产

    // 安装
    npm install

    // 本地环境
    npm run dev

### 效果图

#### 首页

<p style="text-align: center;">
    <img src="https://raw.githubusercontent.com/zwp-hz/blog-markdown-photos/master/README/index_h5.gif" width="30%"/>
    <img src="https://raw.githubusercontent.com/zwp-hz/blog-markdown-photos/master/README/index_pc.gif" width="60%"/>
</p>

#### 照片墙

<p style="text-align: center;">
    <img src="https://raw.githubusercontent.com/zwp-hz/blog-markdown-photos/master/README/photo_h5.gif" width="30%"/>
    <img src="https://raw.githubusercontent.com/zwp-hz/blog-markdown-photos/master/README/photo_pc.gif" width="60%"/>
</p>

### 如何通过 axios 请求接口？

```javascript
this.$axios
  .post(url, param)
  .then(res => {})
  .catch(err => {})
```
