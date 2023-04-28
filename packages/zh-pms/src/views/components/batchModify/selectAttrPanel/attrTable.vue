<template>
  <div>
    <div class="d-flex justify-content-between align-items-center">
      <div class="fw-bold">可选属性列表</div>
      <el-form size="mini" inline class="no-message" @submit.native.prevent="onSearch">
        <el-form-item label="属性名">
          <el-input v-model="form.attrName" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" native-type="submit">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div style="height:360px">
      <g-table ref="table"
               :headers="headers"
               page-layout="sizes, prev, pager, next, jumper"
               :pager-count="5"
               :fetch="fetch"
               immediate
               :diff-height="-3"
               @rendered="_onToggleRowSelection"
               @select="_onSelect"
               @select-all="_onSelect"
      >
        <el-table-column slot="name" label="属性名称" width="100">
          <template slot-scope="{row}">
            <g-text-ellipsis>{{ row.attrName }}</g-text-ellipsis>
          </template>
        </el-table-column>
        <el-table-column slot="from" label="属性来源">
          <template slot-scope="{row}">
            <g-text-ellipsis>{{ (row.attrSource||[]).join(', ') }}</g-text-ellipsis>
          </template>
        </el-table-column>
      </g-table>
    </div>
  </div>
</template>

<script>
import tableSelection from '../../../mixins/tableSelection'
import { getAttrs } from '@/api/batchModifySPUSKU'
import { logisticsAttrs } from '../data'

export default {
  name: 'AttrTable',
  mixins: [tableSelection({ ref: 'table', checkedFiled: 'checked', emitName: 'select', uidField: 'fieldId' })],
  props: {
    /** @type {ZHKJ.VueProps<{id:string;code:number;productCode:string}[]>} */
    productInfo: {
      type: Array
    },
    hasChecked: Array
  },
  data() {
    return {
      headers: [
        { type: 'selection', align: 'center' },
        { slot: true, slotName: 'name' },
        { slot: true, slotName: 'from' }
      ],
      form: {
        attrName: ''
      },
      checked: [...this.hasChecked]
    }
  },
  methods: {
    fetch(query, params = {}) {
      if (this.productInfo.length === 0) {
        return Promise.resolve({
          records: [...logisticsAttrs],
          total: logisticsAttrs.length
        })
      }

      params.productInfo = this.productInfo
      return getAttrs(query, params).then(res => {
        res.data.records.unshift(...logisticsAttrs)
        return res.data
      })
    },
    onSearch() {
      const attrName = this.form.attrName.trim()
      const params = {}
      if (attrName) params.attrName = attrName
      this.$refs.table.load(1, params)
    }
  }
}
</script>
