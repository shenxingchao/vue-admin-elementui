<template>
  <div class="app-container">
    <custom-table id="article-list" :data="List" :table-head="tableHead" :params="params" :show-selection="true"
                  :opt-width="180" @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange"
                  @handleSelectionChange="handleSelectionChange" @handleRowDblClick="handleRowDblClick"
                  @handleEdit="handleEdit" @handleDelete="handleDelete">
      <template v-slot:opt="slotProps">
        <el-button size="mini" icon="el-icon-download" type="warning"
                   @click.stop="handleDownload(slotProps.scope.$index, slotProps.scope.row)">
        </el-button>
      </template>
    </custom-table>
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
            message: '删除成功',
            type: 'success'
          })
        })
        .catch(() => {})
    },
    handleDownload(index, row) {
      this.$message({
        message: '当前下载的id是' + row.id,
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