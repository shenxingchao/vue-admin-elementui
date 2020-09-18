<template>
  <div class="app-container">
    <el-card shadow="hover">
      <el-row type="flex" justify="left">
        <el-col :xs="24" :md="12">
          <el-form ref="ruleForm" :rules="rules" :model="ruleForm" label-position="right" label-width="150px">
            <el-form-item :label="$t('field.title')" prop="title">
              <el-input v-model="ruleForm.title" :placeholder="$t('field.title')" />
            </el-form-item>
            <el-form-item :label="$t('field.image')" prop="image">
              <Upload @handleUploadSuccess="handleUploadSuccess($event)" @handleDeleteFile="ruleForm.image = ''">
              </Upload>
            </el-form-item>
            <el-form-item :label="$t('field.author')" prop="author">
              <el-input v-model="ruleForm.author" :placeholder="$t('field.author')" />
            </el-form-item>
            <el-form-item :label="$t('field.detail')" prop="detail">
              <QuillEditor :url="serverUrl" :header="header" :value="ruleForm.detail" @input="input($event)">
              </QuillEditor>
            </el-form-item>
            <el-form-item :label="$t('field.recommend')" prop="recommend">
              <el-switch v-model="ruleForm.recommend" active-color="#13ce66" inactive-color="#ff4949">
              </el-switch>
            </el-form-item>
            <el-form-item :label="$t('field.top')" prop="top">
              <el-switch v-model="ruleForm.top" active-color="#13ce66" inactive-color="#ff4949">
              </el-switch>
            </el-form-item>
            <el-form-item :label="$t('field.status')" prop="">
              <el-switch v-model="ruleForm.status" active-color="#13ce66" inactive-color="#ff4949">
              </el-switch>
            </el-form-item>
            <el-form-item>
              <el-button type="success" @click="submitForm('ruleForm')">{{$t('opt.save')}}</el-button>
              <el-button @click="resetForm('ruleForm')">{{$t('opt.reset')}}</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>
 
<script>
import { articleEdit, articleDetail } from '@/api/article'
import Upload from '@/components/Upload'
import QuillEditor from '@/components/QuillEditor'
import { getToken } from '@/utils/auth'
import { configUrl } from '@/utils/config'

export default {
  name: 'ArticleEdit',
  components: {
    Upload,
    QuillEditor
  },
  data() {
    return {
      ruleForm: {
        id: this.$route.query.id,
        title: '',
        image: '',
        author: '',
        type: '',
        detail: '',
        recommend: true,
        top: true,
        status: true
      },
      rules: {
        title: [
          {
            required: true,
            message: this.$i18n.t('tips.input') + this.$i18n.t('field.title'),
            trigger: 'blur'
          }
        ],
        image: [
          {
            required: true,
            message: this.$i18n.t('tips.upload') + this.$i18n.t('field.image')
          }
        ],
        author: [
          {
            required: true,
            message: this.$i18n.t('tips.input') + this.$i18n.t('field.author'),
            trigger: 'blur'
          }
        ],
        detail: [
          {
            required: true,
            message: this.$i18n.t('tips.input') + this.$i18n.t('field.detail')
          }
        ]
      },
      header: {
        'X-Token': getToken()
      },
      serverUrl: configUrl + '/Upload/fileUpload'
    }
  },
  mounted() {
    this.getArticleDetail()
  },
  methods: {
    getArticleDetail() {
      articleDetail({ id: this.ruleForm.id })
        .then(res => {
          this.ruleForm = res.data
        })
        .catch(() => {})
    },
    submitForm(formName) {
      const _this = this
      this.$refs[formName].validate(valid => {
        if (valid) {
          articleEdit(this.ruleForm)
            .then(res => {
              this.$message({
                message: this.$i18n.t('tips.edit_success'),
                type: 'success',
                onClose: function() {
                  _this.$router.push('/article/article-list')
                }
              })
            })
            .catch(() => {})
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    handleUploadSuccess: function(imgUrl) {
      this.ruleForm.image = imgUrl
      this.$refs['ruleForm'].clearValidate('image')
    },
    input: function(content) {
      this.ruleForm.detail = content
    }
  }
}
</script>
  
<style lang="scss">
</style>
