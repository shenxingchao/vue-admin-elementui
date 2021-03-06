<template>
  <div>
    <div v-if="showFilter||showSearch" class="check-cloumn-container">
      <slot v-if="showSearch" name="searchBar"></slot>
      <el-dropdown v-if="showFilter" class="filter">
        <el-button type="primary" size="mini">
          筛选<i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <div class="clear-btn-box">
            <el-button size="mini" icon="el-icon-refresh" type="primary" @click="handleClickClearCache">
              清除缓存
            </el-button>
          </div>
          <el-checkbox v-model="checkAll" class="check-column-item" :indeterminate="isIndeterminate"
                       @change="handleCheckAllChange">全选
          </el-checkbox>
          <el-checkbox-group v-model="checkedColumn" @change="handleCheckedColumnChange">
            <div v-for="(item,index) in tableHead" :key="index">
              <el-checkbox class="check-column-item" :label="item.label">{{item.label}}</el-checkbox>
            </div>
          </el-checkbox-group>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <el-table :id="id" :key="key" ref="multipleTable" :data="data" :row-key="hanldeRowKey" border fit default-expand-all
              size="mini" tooltip-effect="dark" style="width: 100%" @header-dragend="handleHeaderDrag"
              @row-click="handleRowClick" @select="handleSelect" @select-all="handleSelectAll"
              @selection-change="handleSelectionChange" @row-dblclick="handleRowDblClick">
      <!-- 多选框checkbox -->
      <el-table-column v-if="showSelection" type="selection" width="55">
      </el-table-column>
      <el-table-column v-for="(item,index) in tableHeadOptions" :key="index" :width="item.width ? item.width : ''"
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
      <!-- 操作列 -->
      <el-table-column v-if="showOpt" align="center" label="操作" :min-width="optWidth">
        <template slot-scope="scope">
          <el-button size="mini" icon="el-icon-edit" type="primary" @click.stop="handleEdit(scope.$index, scope.row)">
          </el-button>
          <el-button size="mini" icon="el-icon-delete" type="danger"
                     @click.stop="handleDelete(scope.$index, scope.row)"></el-button>
          <slot :scope="scope" name="opt">
          </slot>
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
import Sortable from 'sortablejs' //拖拽插件
export default {
  name: 'CustomTable',
  components: {
    CustomTag,
    Sortable,
  },
  props: {
    //表格id
    id: {
      type: String,
      default: '',
    },
    //显示多选框
    showSelection: {
      type: Boolean,
      default: true,
    },
    //多选框是否为单选
    isRadio: {
      type: Boolean,
      default: false,
    },
    //表头数据
    tableHead: {
      type: Array,
      default: () => {
        return []
      },
    },
    //表格数据
    data: {
      type: Array,
      default: () => {
        return []
      },
    },
    //显示分页
    showPage: {
      type: Boolean,
      default: true,
    },
    //分页参数
    params: {
      type: Object,
      default: null,
    },
    //显示筛选
    showFilter: {
      type: Boolean,
      default: true,
    },
    //显示搜索
    showSearch: {
      type: Boolean,
      default: true,
    },
    //显示操作
    showOpt: {
      type: Boolean,
      default: true,
    },
    //操作列最小宽度
    optWidth: {
      type: Number,
      default: 120,
    },
  },
  data() {
    return {
      key: 0, //table的key
      tableHeadOptions: {}, //实际显示的tableHead
      selectionId: null, //当前选中id临时变量
      checkAll: true, //全选
      checkedColumn: [], //字段筛选列表
      isIndeterminate: false, //全选按钮 样式  - 或者是 √
    }
  },
  watch: {
    checkedColumn(val) {
      this.tableHeadOptions = this.tableHead.filter((i) => {
        return val.indexOf(i.label) >= 0
      })
      this.key += 1 //fix 抖动 bug
      setTimeout(() => {
        this.rowDrop() //每次重绘表格在执行拖动
      }, 100)
    },
  },
  mounted() {
    this.initHead()
  },
  methods: {
    //初始化表头
    initHead(isClearCache = false) {
      //获取浏览器缓存的列宽
      if (localStorage.getItem(this.id) == null) {
        localStorage.setItem(this.id, JSON.stringify(this.tableHead))
      } else {
        let tamptableHead = JSON.parse(localStorage.getItem(this.id))

        tamptableHead.forEach((element) => {
          let x = this.tableHead.find((obj) => obj.label == element.label)
          x.width = element.width
        })
      }
      //是否是清除缓存
      if (!isClearCache) {
        //放入筛选列
        this.tableHead.forEach((element) => {
          this.checkedColumn.push(element.label)
        })
      } else {
        this.key += 1
      }
    },
    //行key
    hanldeRowKey(row) {
      return row.id
    },
    //分页
    handleSizeChange(val) {
      this.$emit('handleSizeChange', val)
    },
    //分页
    handleCurrentChange(val) {
      this.$emit('handleCurrentChange', val)
    },
    //单击一行 选中
    handleRowClick(row) {
      if (this.isRadio) {
        //单选
        this.$refs.multipleTable.clearSelection()
        if (row) {
          //如果选中了行
          if (row.id == this.selectionId) {
            //如果选中的还是上一行
            this.selectionId = ''
            this.$emit('handleSelectionChange', null)
            this.$refs.multipleTable.toggleRowSelection(row, false)
          } else {
            //如果是其他行
            this.selectionId = row.id
            this.$emit('handleSelectionChange', row.id)
            this.$refs.multipleTable.toggleRowSelection(row, true)
          }
        } else {
          //如果没有选中
          this.selectionId = ''
          this.$emit('handleSelectionChange', null)
          this.$refs.multipleTable.toggleRowSelection(row, true)
        }
      } else {
        //多选
        let multipleTable = this.$refs.multipleTable
        multipleTable.toggleRowSelection(row)
      }
    },
    //选择
    handleSelect(selection, row) {
      if (this.isRadio) {
        // 清除所有选中
        this.$refs.multipleTable.clearSelection()
        if (selection.length === 0) {
          this.$emit('handleSelectionChange', null)
          return
        }
        // 将当前点击项选中
        this.$refs.multipleTable.toggleRowSelection(row, true)
        if (row) {
          this.$emit('handleSelectionChange', row.id)
        }
      }
    },
    //全选
    handleSelectAll(selection, row) {
      if (this.isRadio) {
        this.$refs.multipleTable.clearSelection()
        console.log('null')
      }
    },
    //选中行状态改变
    handleSelectionChange(rows) {
      if (!this.isRadio) {
        //多选
        let selectionIdList = []
        rows.forEach((element) => {
          selectionIdList.push(element.id)
        })
        this.$emit('handleSelectionChange', selectionIdList)
      }
    },
    //双击打开编辑
    handleRowDblClick(val) {
      let id = val.id
      this.$emit('handleRowDblClick', id)
    },
    //编辑操作
    handleEdit(index, row) {
      this.$emit('handleEdit', index, row)
    },
    //删除操作
    handleDelete(index, row) {
      this.$emit('handleDelete', index, row)
    },
    //拖动表头 改变宽度 保存到localstorage
    handleHeaderDrag(newWidth, oldWidth, column, event) {
      setTimeout(() => {
        let table_key = this.id
        let applyTableColWidths = []
        let applyTable = document.getElementById(table_key)
        let applyTableColgroup = applyTable.getElementsByTagName('colgroup')[0]
        let applyTableCol = applyTableColgroup.getElementsByTagName('col')
        //这里循环变量i是head字段在表头th中的顺序 需要去掉选择框 和 操作列 这2列是固定的
        for (
          let i = this.showSelection ? 1 : 0, j = 0;
          i <
          (this.showOpt ? applyTableCol.length - 2 : applyTableCol.length - 1);
          i++, j++
        ) {
          applyTableColWidths.push({
            label: this.tableHeadOptions[j].label,
            width: applyTableCol[i].width,
          })
        }
        let oldTableHead = JSON.parse(localStorage.getItem(this.id))

        //循环 并更新 指定字段宽度
        oldTableHead.forEach((element) => {
          let x = applyTableColWidths.find((obj) => obj.label == element.label)
          if (x) {
            element.width = x.width
          }
        })

        //更新tableHead 数据
        oldTableHead.forEach((element) => {
          let x = this.tableHead.find((obj) => obj.label == obj.label)
          if (x) {
            x.width = element.width
          }
        })

        //保存到localstorage
        localStorage.setItem(table_key, JSON.stringify(oldTableHead))
      }, 100)
    },
    //行拖动交换 触发函数参数为交换记录行的id值
    rowDrop() {
      const tbody = document.querySelector('.el-table__body-wrapper tbody')
      const _this = this

      Sortable.create(tbody, {
        onEnd({ newIndex, oldIndex }) {
          const currRow = _this.data.splice(oldIndex, 1)[0]
          _this.data.splice(newIndex, 0, currRow)
          _this.$emit('handleRowRrop', _this.data) //当前页新的排序数据
        },
      })
    },
    //全选
    handleCheckAllChange(val) {
      this.checkedColumn = []

      if (val) {
        this.tableHead.forEach((element) => {
          this.checkedColumn.push(element.label)
        })
      }

      this.isIndeterminate = false
    },
    //切换筛选
    handleCheckedColumnChange(value) {
      let checkedCount = value.length
      this.checkAll = checkedCount === this.tableHead.length
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.tableHead.length
    },
    //清除缓存
    handleClickClearCache() {
      localStorage.removeItem(this.id)
      this.initHead(true)
    },
  },
}
</script>

<style lang="scss" scoped>
.check-cloumn-container {
  display: flex;
  justify-content: space-between;
  align-items: top;
  .filter {
    width: 73px;
    margin-bottom: 18px;
  }
}
.check-column-item {
  padding: 4px 8px;
}

.el-dropdown-menu {
  .clear-btn-box {
    padding: 0 10px;
  }
}
</style>