<template>
  <g-table ref="table"
           :headers="headers"
           :fetch="fetch"
           page-layout="sizes, prev, pager, next, jumper"
           :pager-count="5"
           :diff-height="-3"
           @rendered="_onToggleRowSelection"
           @select="_onSelect"
           @select-all="_onSelect"
  >
    <el-table-column slot="image" label="缩略图" width="70">
      <template #default="{row}">
        <g-thumb :url="row.imageUrl" class="d-table-cell" />
      </template>
    </el-table-column>
    <el-table-column slot="name" label="中文名称">
      <template #default="{row}">
        <g-text-ellipsis>{{ row.productName }}</g-text-ellipsis>
      </template>
    </el-table-column>
    <el-table-column slot="type" label="类型" width="60">
      <template #default="{row}">
        {{ sxu[row.type] }}
      </template>
    </el-table-column>
    <el-table-column slot="status" label="状态" width="70">
      <template #default="{row}">
        {{ statusMapping[String(row.status)] }}
      </template>
    </el-table-column>
  </g-table>
</template>

<script>
import { getDict } from '@/api/common/dict'
import { getSxuList } from '@/api/batchModifySPUSKU'
import tableSelection from '../../../mixins/tableSelection'

export default {
  name: 'SxuTable',
  mixins: [tableSelection({ ref: 'table', checkedFiled: 'checked', emitName: 'select' })],
  props: {
    // 传入搜索条件
    params: Object,
    hasChecked: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      headers: [
        { type: 'selection', align: 'center' },
        { slot: true, slotName: 'image' },
        { slot: true, slotName: 'type' },
        { label: '编码', prop: 'productCode', width: 100 },
        { slot: true, slotName: 'name' },
        { label: '牛蛙编码', prop: 'nwCode', width: 100 },
        { slot: true, slotName: 'status' }
      ],
      statusMapping: {},
      sxu: ['', 'SPU', 'SKU'],
      checked: [...this.hasChecked]
    }
  },
  watch: {
    params(val) {
      this.$refs.table.load(1, val)
    }
  },
  created() {
    this.getDict()
  },
  mounted() {
    this.$refs.table.load(1, this.params)
  },
  methods: {
    getDict() {
      getDict('sku_status', 'pms').then(list => {
        this.statusMapping = list.reduce((prev, item) => {
          prev[item.value] = item.label
          return prev
        }, {})
      })
    },
    fetch(query, params) {
      return getSxuList(query, params, this).then(res => res.data)
    }
  }
}
</script>
