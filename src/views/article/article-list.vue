<template>
  <div class="app-container">
    <el-card shadow="hover">
      <custom-table id="article-list" :data="List" :table-head="tableHead" :params="params" :show-selection="true"
                    :opt-width="180" @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange"
                    @handleSelectionChange="handleSelectionChange" @handleRowDblClick="handleRowDblClick"
                    @handleEdit="handleEdit" @handleDelete="handleDelete">
        <template v-slot:searchBar>
          <el-form ref="searchForm" :inline="true" :model="params" class="demo-form-inline" size="mini">
            <el-form-item prop="keyword">
              <el-input v-model="params.keyword" :placeholder="$t('field.keyword')" />
            </el-form-item>
            <el-form-item prop="recommend">
              <el-select v-model="params.recommend" :placeholder="$t('field.recommend')">
                <el-option :label="$t('field.yes')" :value="true"> </el-option>
                <el-option :label="$t('field.no')" :value="false"> </el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="top">
              <el-select v-model="params.top" :placeholder="$t('field.top')">
                <el-option :label="$t('field.yes')" :value="true"> </el-option>
                <el-option :label="$t('field.no')" :value="false"> </el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="status">
              <el-select v-model="params.status" :placeholder="$t('field.status')">
                <el-option :label="$t('field.show')" :value="true"> </el-option>
                <el-option :label="$t('field.hide')" :value="false">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" @click.native="onSubmit">{{ $t('opt.search') }}
              </el-button>
              <el-button icon="el-icon-refresh-left" @click.native="$refs['searchForm'].resetFields();onSubmit()">
                {{ $t('opt.reset') }}
              </el-button>
              <el-button type="primary" icon="el-icon-plus" size="mini"
                         @click.native="$router.push('/article/article-add')">{{ $t('opt.add') }}
              </el-button>
              <el-button type="danger" icon="el-icon-delete" size="mini" @click.native="handleDeleteRows">
                {{ $t('opt.delete') }}
              </el-button>
              <el-button type="warning" icon="el-icon-rank" @click="dialogVisible = true">{{ $t('opt.dialog') }}
              </el-button>
            </el-form-item>
          </el-form>
        </template>
        <template v-slot:opt="slotProps">
          <el-button size="mini" icon="el-icon-download" type="warning"
                     @click.stop="handleDownload(slotProps.scope.$index, slotProps.scope.row)">
          </el-button>
        </template>
      </custom-table>
    </el-card>
    <el-dialog v-el-drag-dialog :title="$t('opt.dialog')" :visible.sync="dialogVisible">
      <span>{{$t('info.move_dialog')}}</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">{{$t('opt.cancel')}}</el-button>
        <el-button type="primary" @click="dialogVisible = false">{{
          $t('opt.confirm')
        }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import CustomTable from '@/components/CustomTable'
import { articleLst, articleDelete } from '@/api/article'
export default {
  name: 'ArticleList',
  components: {
    CustomTable
  },
  data() {
    return {
      List: [],
      selectionIdList: [],
      tableHead: [
        {
          label: this.$i18n.t('field.id'),
          prop: 'id',
          width: 60
        },
        {
          label: this.$i18n.t('field.title'),
          prop: 'title',
          width: 300
        },
        {
          label: this.$i18n.t('field.image'),
          prop: 'image',
          render: row => {
            return '<img  src="' + row.image + '" class="table-img"/>'
          }
        },
        {
          label: this.$i18n.t('field.author'),
          prop: 'author'
        },
        {
          label: this.$i18n.t('field.recommend'),
          prop: 'recommend',
          component: row => {
            return row.recommend
              ? { is: 'custom-tag', type: 'success', title: '是' }
              : { is: 'custom-tag', type: 'danger', title: '否' }
          }
        },
        {
          label: this.$i18n.t('field.top'),
          prop: 'top',
          component: row => {
            return row.top
              ? { is: 'custom-tag', type: 'success', title: '是' }
              : { is: 'custom-tag', type: 'danger', title: '否' }
          }
        },
        {
          label: this.$i18n.t('field.status'),
          prop: 'status',
          component: row => {
            return row.status
              ? { is: 'custom-tag', type: 'success', title: '启用' }
              : { is: 'custom-tag', type: 'danger', title: '禁用' }
          }
        },
        {
          label: this.$i18n.t('field.addtime'),
          prop: 'addtime',
          width: 140
        },
        {
          label: this.$i18n.t('field.updatetime'),
          prop: 'updatetime',
          width: 140
        }
      ],
      params: {
        page: 1,
        total: 0,
        pageSize: 10,
        pageSizes: [10, 20, 30, 50],
        keyword: '',
        recommend: '',
        top: '',
        status: ''
      },
      dialogVisible: false //可移动弹窗
    }
  },
  async mounted() {
    await this.getArticleLst()
  },
  methods: {
    getArticleLst() {
      return articleLst(this.params)
        .then(res => {
          this.List = res.data.data
          this.params.total = res.data.total
        })
        .catch(() => {})
    },
    handleSizeChange(val) {
      this.params.pageSize = val
      this.getArticleLst()
    },
    handleCurrentChange(val) {
      this.params.page = val
      this.getArticleLst()
    },
    handleSelectionChange(val) {
      this.selectionIdList = val
    },
    handleRowDblClick(val) {
      this.$router.push({
        path: '/article/article-edit',
        query: {
          id: val
        }
      })
    },
    handleEdit(index, row) {
      this.handleRowDblClick(row.id)
    },
    handleDelete(index, row) {
      articleDelete({ ids: [row.id] })
        .then(res => {
          this.List.splice(index, 1)
          this.$message({
            message: this.$i18n.t('tips.delete_success'),
            type: 'success'
          })
        })
        .catch(() => {})
    },
    handleDownload(index, row) {
      this.$message({
        message: this.$i18n.t('tips.download_info') + row.id,
        type: 'success'
      })
    },
    handleDeleteRows() {
      let self = this
      if (this.selectionIdList.length == 0) {
        this.$message({
          message: this.$i18n.t('tips.select_delete'),
          type: 'error'
        })
        return false
      }
      articleDelete({ ids: this.selectionIdList })
        .then(res => {
          //这里删除还可以使用逆向循环删除，删除以后还可以重新获取数据
          this.List = this.List.filter(
            item => this.selectionIdList.indexOf(item.id) == -1
          )
          this.$message({
            message: this.$i18n.t('tips.delete_success'),
            type: 'success',
            onClose: function() {
              self.getArticleLst()
            }
          })
        })
        .catch(() => {})
    },
    onSubmit() {
      this.params.page = 1
      this.params.pageSize = 10
      this.getArticleLst()
    }
  }
}
</script>

<style></style>
