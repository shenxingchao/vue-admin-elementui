<template>
  <div class="login-container">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on"
             label-position="left">
      <div class="title-container">
        <h3 class="title">{{$t('info.site_title')}}</h3>
      </div>
      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input ref="username" v-model="loginForm.username" :placeholder="$t('field.username')" name="username"
                  type="text" tabindex="1" auto-complete="on" />
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input :key="passwordType" ref="password" v-model="loginForm.password" :type="passwordType"
                  :placeholder="$t('field.password')" name="password" tabindex="2" auto-complete="on"
                  @keyup.enter.native="handleLogin" />
        <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
        </span>
      </el-form-item>
      <div class="lang-change">
        <el-radio v-model="lang" label="zh" @click.native="changeLang('zh')">中文</el-radio>
        <el-radio v-model="lang" label="en" @click.native="changeLang('en')">English
        </el-radio>
      </div>
      <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;"
                 @click.native.prevent="handleLogin">{{$t('opt.login')}}</el-button>
    </el-form>
  </div>
</template> 

<script>
export default {
  name: 'Login',
  data() {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      loginRules: {
        username: [
          {
            required: true,
            trigger: 'blur',
            message: this.$i18n.t('tips.input') + this.$i18n.t('field.username')
          }
        ],
        password: [
          {
            required: true,
            trigger: 'blur',
            message: this.$i18n.t('tips.input') + this.$i18n.t('field.password')
          }
        ]
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined,
      lang: localStorage.lang || 'zh'
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  methods: {
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store
            .dispatch('user/login', this.loginForm)
            .then(() => {
              this.$router.push({ path: this.redirect || '/' })
              this.loading = false
            })
            .catch(() => {
              this.loading = false
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    changeLang(lang) {
      localStorage.setItem('lang', lang)
      //目前先这样刷新，路由里的标题不会随之改变
      this.$router.go(0)
      // this.lang = lang
      // this.$i18n.locale = lang
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #283443;
$light_gray: #fff;
$cursor: $theme;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;
    input {
      color: $h1c !important;
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $light_gray inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>
<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  // background: url('../../assets/login/login-background.png') 100% 100% no-repeat;
  overflow: hidden;
  position: relative;
  z-index: 1;
  &::after {
    content: '';
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    background: rgba($color: $bg, $alpha: 1);
    z-index: 1;
  }
  .login-form {
    z-index: 2;
    position: relative;
    width: 440px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }
  .el-form-item {
    background: #ffffff;
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
    .svg-icon {
      color: $theme;
    }
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: #ffffff;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }

  .lang-change {
    margin-bottom: 20px;
  }
}
</style>
