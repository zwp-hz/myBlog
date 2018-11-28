# 🐷的个人博客

## 目录结构介绍

    |-- assest                        	  // 资源文件
    |-- components                    	  // 组件
    |-- layouts                           // 默认布局
    |-- middleware                        // 中间件
    |-- pages                             // 路由页面
    |-- plugins                           // 插件
    |-- static                            // 静态文件
    |-- store                             // Vuex 状态树
    |-- .eslintrc.js                      // eslint 配置文件
    |-- .prettierrc                       // prettierrc 配置文件
    |-- nuxt.config.js                    // nuxt 配置文件
    |-- package.json                      // 项目及工具的依赖配置文件
    |-- README.md                         // 说明

## 构建生产

    // 本地环境
    npm run dev

    // 开发环境
    npm run generate

    // 测试环境
    npm run development

    // 预发环境
    npm run pre

    // 线上环境
    npm run online

### 任何通过 axios 请求接口？

```javascript
this.$axios
  .post(url, param)
  .then(res => {})
  .catch(err => {})
```
