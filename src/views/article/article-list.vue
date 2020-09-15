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
              <el-input v-model="params.keyword" placeholder="搜索关键词" />
            </el-form-item>
            <el-form-item prop="recommend">
              <el-select v-model="params.recommend" placeholder="推荐">
                <el-option label="是" :value="true">
                </el-option>
                <el-option label="否" :value="false">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="top">
              <el-select v-model="params.top" placeholder="置顶">
                <el-option label="是" :value="true">
                </el-option>
                <el-option label="否" :value="false">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="status">
              <el-select v-model="params.status" placeholder="状态">
                <el-option label="显示" :value="true">
                </el-option>
                <el-option label="隐藏" :value="false">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" @click.native="onSubmit">查询</el-button>
              <el-button icon="el-icon-refresh-left" @click.native="$refs['searchForm'].resetFields();onSubmit()">重置
              </el-button>
              <el-button type="primary" icon="el-icon-plus" size="mini"
                         @click.native="$router.push('/article/article-add')">添加
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
      }
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
      articleDelete({ id: row.id })
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
    onSubmit() {
      this.params.page = 1
      this.params.pageSize = 10
      this.getArticleLst()
    }
  }
}
</script>
  
<style>
</style>