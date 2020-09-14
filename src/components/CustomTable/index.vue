<template>
  <div>
    <el-table :id="id" ref="multipleTable" :data="data" border fit size="mini" tooltip-effect="dark" style="width: 100%"
              @header-dragend="handleHeaderDrag" @row-click="handleRowClick" @selection-change="handleSelectionChange"
              @row-dblclick="handleRowDblClick">
      <!-- 多选框checkbox -->
      <el-table-column v-if="showSelection" type="selection" width="55">
      </el-table-column>
      <el-table-column v-for="(item,index) in tableHead" :key="index" :width="item.width ? item.width : ''"
                       :align="item.align||'center'" :label="item.label" :prop="item.prop"
                       :sortable="item.sortable ? 'custom' : false" show-overflow-tooltip>
        <template slot-scope="scope">
          <!-- 单元格渲染html代码 -->
          <template v-if="item.render"><span v-html="item.render(scope.row)"></span></template>
          <!-- 渲染动态组件,这里只用到了tag组件,其他组件自行实现 -->
          <template v-else-if="item.component">
            <component :is="item.component(scope.row).is" :type="item.component(scope.row).type"
                       :title="item.component(scope.row).title"></component>
          </template>
          <!-- 渲染普通文字 -->
          <template v-else>{{scope.row[item.prop]}}</template>
        </template>
      </el-table-column>
    </el-table>
    <div v-if="showPage" class="block">
      <el-pagination :current-page="params.page" :total="params.total" :page-sizes="params.pageSizes"
                     :page-size="params.pageSize" background layout="total, sizes, prev, pager, next, jumper"
                     @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>
  </div>
</template>
<script>
import CustomTag from '@/components/CustomTag'
export default {
  name: 'CustomTable',
  components: {
    CustomTag
  },
  props: {
    id: {
      type: String,
      default: ''
    },
    showSelection: {
      type: Boolean,
      default: true
    },
    tableHead: {
      type: Array,
      default: () => {
        return []
      }
    },
    data: {
      type: Array,
      default: () => {
        return []
      }
    },
    showPage: {
      type: Boolean,
      default: true
    },
    params: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      selectionList: [] //选中行的id数组 1,2,3,4...
    }
  },
  mounted() {
    this.getTableColWidth()
  },
  methods: {
    handleSizeChange(val) {
      this.$emit('handleSizeChange', val)
    },
    handleCurrentChange(val) {
      this.$emit('handleCurrentChange', val)
    },
    //单击一行 选中
    handleRowClick(row) {
      let multipleTable = this.$refs.multipleTable
      multipleTable.toggleRowSelection(row)
    },
    //选中行状态改变
    handleSelectionChange(val) {
      let selectionIdList = []
      val.forEach(element => {
        selectionIdList.push(element.id)
      })
      this.$emit('handleSelectionChange', selectionIdList)
    },
    //双击打开编辑
    handleRowDblClick(val) {
      let id = val.id
      this.$emit('handleRowDblClick', id)
    },
    //拖动表头 改变宽度 保存到localstorage
    handleHeaderDrag(newWidth, oldWidth, column, event) {
      setTimeout(() => {
        let table_key = this.id
        let applyTableColWidths = []
        let applyTable = document.getElementById(table_key)
        let applyTableColgroup = applyTable.getElementsByTagName('colgroup')[0]
        let applyTableCol = applyTableColgroup.getElementsByTagName('col')
        for (let i = 0; i < applyTableCol.length; i++) {
          applyTableColWidths.push(applyTableCol[i].width)
        }
        localStorage.setItem(table_key, JSON.stringify(applyTableColWidths))
      }, 100)
    },
    //获取浏览器缓存的列宽
    getTableColWidth() {
      let tableWidth = localStorage.getItem(this.id)
      if (tableWidth) {
        tableWidth = JSON.parse(tableWidth)
        for (let i = 0, length = this.tableHead.length; i < length; i++) {
          this.tableHead[i].width = tableWidth[i]
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>