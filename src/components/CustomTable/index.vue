<template>
  <div>
    <el-table :data="data" border fit size="mini" tooltip-effect="dark" style="width: 100%">
      <el-table-column v-for="(item,index) in tableHead" :key="index" :width="item.width ? item.width : ''"
                       :align="item.align||'center'" :label="item.label" :prop="item.prop"
                       :sortable="item.sortable ? 'custom' : false" show-overflow-tooltip>
        <template slot-scope="scope">
          <template v-if="item.render"><span v-html="item.render(scope.row)"></span></template>
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
export default {
  name: 'CustomTable',
  props: {
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
  methods: {
    handleSizeChange(val) {
      this.$emit('handleSizeChange', val)
    },
    handleCurrentChange(val) {
      this.$emit('handleCurrentChange', val)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>