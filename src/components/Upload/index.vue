<template>
  <div class="upload-file-commpent">
    <div v-if="imgUrl" class="uplaod-file-preview" @mouseenter="isShowOpt = true" @mouseleave="isShowOpt = false">
      <img :src="imgUrl" alt="上传成功图片" />
      <div v-show="isShowOpt" class="opt">
        <i class="el-icon-delete delete-btn" @click="handleClickDelete()"></i>
      </div>
    </div>
    <div v-if="!imgUrl" class="upload-file-btn" @click="$refs.file.click()">
      <i class="el-icon-plus"></i>
      <input ref="file" type="file" class="upload-file-input" :accept="fileType"
             @change="handleUploadFile($event.target.files[0])" />
    </div>
  </div>
</template>
<script>
import { fileUpload } from '@/api/upload'
export default {
  name: 'Upload',
  props: {
    file: {
      type: String,
      default: ''
    },
    fileType: {
      type: String,
      default: 'image/*'
    }
  },
  data() {
    return {
      imgUrl: '',
      isShowOpt: false
    }
  },
  watch: {
    file: function(newValue, oldValue) {
      this.imgUrl = newValue
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.imgUrl = this.file
    })
  },
  methods: {
    /**
     * 文件上传
     */
    handleUploadFile: function(file) {
      let fd = new FormData()
      fd.append('file', file)
      fileUpload(fd)
        .then(res => {
          this.imgUrl = res.data.imgUrl
          this.$message({
            message: '上传成功',
            type: 'success',
            onClose: function() {}
          })
          //子组件通知父组件上传成功
          this.$emit('handleUploadSuccess', this.imgUrl)
        })
        .catch(() => {})
    },
    /**
     * 文件删除
     */
    handleClickDelete: function() {
      this.imgUrl = ''
      this.$emit('handleDeleteFile')
    }
  }
}
</script>
<style lang="scss" scoped>
.upload-file-commpent {
  .uplaod-file-preview {
    width: 100px;
    height: 100px;
    position: relative;
    img {
      width: 100%;
      height: 100%;
      display: block;
    }
    .opt {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      background: rgba($color: #000000, $alpha: 0.3);
      .delete-btn {
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        color: #ffffff;
        position: absolute;
        top: 0;
        right: 0;
      }
    }
  }
  .upload-file-btn {
    width: 100px;
    height: 100px;
    border: 1px dashed #cccccc;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    &:hover {
      border-color: #409eff;
    }
    .el-icon-plus {
      font-size: 26px;
      color: #777777;
    }
    .upload-file-input {
      display: none;
    }
  }
}
</style>
/** 
@图片上传组件
引入
import Upload from '@/components/Upload'

使用
<Upload :file="ruleForm.avatar" @handleUploadSuccess="handleUploadSuccess($event)"
        @handleDeleteFile="ruleForm.avatar = ''">
</Upload>

//上传成功事件
handleUploadSuccess: function(imgUrl) {
    this.ruleForm.avatar = imgUrl
    //取消头像验证
    this.$refs['ruleForm'].clearValidate('avatar')
}
*/