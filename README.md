# vue-admin-elementui

为了简单而生
还在搭建阶段，慎用

[在线预览](https://shenxingchao.github.io/vue-admin-elementui)

![预览](http://demo.o8o8o8.com/vue-admin-elementui/preview.png)

## 下载

git clone git@github.com:shenxingchao/vue-admin-elementui.git

## 换源

npm install --registry=https://registry.npm.taobao.org

## 安装

npm install

## 运行

npm run serve

## 打包

npm run build:prod

## 起步

### 1.全局 scss 配置文件

##### /src/styles/common.scss

这里面定义的变量 所有组件都能用 定义导出用法

```scss
$theme: #50bf8d;
:export {
  theme: $theme;
}
```

### 2.国际化

##### /src/lang/i18n.js

默认中英文二种，不需要删除 en 相关代码和 en.js
其他语言按格式增加即可
组件调用方法

```html
<template>
  <div :attr="$t('hello')">{{$t('hello')}}</div>
</template>
<script>
  export default {
    mounted() {
      this.$i18n.t('hello')
    },
  }
</script>
```

### 3.elementui 主题色

##### /src/styles/common.scss

主题颜色定义最好在这里，因为这个文件里定义的变量已经加载为全局的，包括给下面这个文件用

##### /src/styles/element-variables.scss

所有 elementui 颜色变量配置都在这个文件里，这里的颜色可以用 common.scss 导出的颜色

```scss
/* 改变主题色变量 */
$--color-primary: $theme;
/* 改变 icon 字体路径变量，必需 */
$--font-path: '~element-ui/lib/theme-chalk/fonts';
@import '~element-ui/packages/theme-chalk/src/index';
```

### 4.mockjs 模拟接口数据

##### /src/mock/index.js

请求拦截，模拟返回数据
mockjs 在线编辑器 http://mockjs.com/0.1/editor.html#help

### 5.增删改查案例

#### /src/views/article/...vue

### 后续 1.图片上传组件完善 2.改成可多图上传 3.添加菜单搜索组件 5.修复表格双击时不选中 6.模拟后端返回路由表形成动态路由 7.dashborad 页面
