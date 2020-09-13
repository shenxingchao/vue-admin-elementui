<template>
  <div class="app-container">
    <custom-table :data="List" :table-head="tableHead" :params="params" @handleSizeChange="handleSizeChange"
                  @handleCurrentChange="handleCurrentChange"></custom-table>
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
          render: row => {
            return row.status ? '是' : '否'
          }
        },
        {
          label: this.$i18n.t('field.top'),
          prop: 'top',
          render: row => {
            return row.status ? '是' : '否'
          }
        },
        {
          label: this.$i18n.t('field.status'),
          prop: 'status',
          render: row => {
            return row.status ? '启用' : '禁用'
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
    handleEdit(index, row) {
      this.$router.push({
        path: '/article/article-edit',
        query: {
          id: row.id
        }
      })
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
    handleSizeChange(val) {
      this.params.pageSize = val
      this.getArticleLst()
    },
    handleCurrentChange(val) {
      this.params.page = val
      this.getArticleLst()
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