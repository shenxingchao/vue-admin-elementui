# vue-admin-elementui

为了简单而生

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
##### 请切换到i18n分支,前端路由权限实现方式，后端维护一个菜单表和前端路由结构一致，返回每个菜单对应的id，前端路由表也存这个id，然后通过递归前端路由数组，判断id返回一个新的路由数组动态添加进路由当中即可，这种情况的多语言是维护在前端的，如果后端维护菜单名称多语言，那么和master分支权限实现方式无异

默认中英文二种
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

### 5.增删改查demo

##### /src/views/article/...vue

### 6.多图上传组件


##### 引入
```javascript
import Upload from '@/components/Upload'
```

##### 
```html
<Upload :file="ruleForm.avatar" @handleUploadSuccess="handleUploadSuccess($event)"
        @handleDeleteFile="ruleForm.avatar = ''">
</Upload>
<script>
//上传成功事件
handleUploadSuccess: function(imgUrl) {
    this.ruleForm.avatar = imgUrl
    //取消头像验证
    this.$refs['ruleForm'].clearValidate('avatar')
}
</script>
```
##### 多图上传
```html
<Upload :files="ruleForm.image_list" multiple
        @handleUploadMultipleSuccess="handleUploadMultipleSuccess($event)"
        @handleClickDeleteMultiple="ruleForm.image_list = $event">
</Upload>
<script>
//多图上传成功事件
handleUploadMultipleSuccess: function(imgUrlList) {
  this.ruleForm.image_list = imgUrlList
  this.$refs['ruleForm'].clearValidate('image_list')
}
</script>
```

### 后续 1.dashborad 页面
