# vue-admin-elementui
为了简单而生
还在搭建阶段，慎用

##下载
npm clone git@github.com:shenxingchao/vue-admin-elementui.git
##安装
npm install
##运行
npm run serve
##打包
npm run build

## 起步
### 1.全局scss配置文件
##### /src/styles/common.scss
这里面定义的变量 所有组件都能用 定义导出用法
```scss
$theme: #50BF8D;
:export {
    theme: $theme;
}
```

### 2.国际化
##### /src/lang/i18n.js
默认中英文二种，不需要删除en相关代码和en.js
其他语言按格式增加即可
组件调用方法
```html
<template>
	<div :attr="$t('hello')">{{$t('hello')}}</div>
</template>
<script>
export default {
	mounted(){
		this.$i18n.t('hello')
	}
}
</script>
```

### 3.elementui 主题色
##### /src/styles/element-variables.scss
所有elementui颜色变量配置都在这个文件里
```scss
/* 改变主题色变量 */
$--color-primary: #0ba862;
/* 改变 icon 字体路径变量，必需 */
$--font-path: '~element-ui/lib/theme-chalk/fonts';
@import "~element-ui/packages/theme-chalk/src/index";
```