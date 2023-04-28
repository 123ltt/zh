<template>
  <div style="height:430px">
    <g-table ref="table"
             row-key="id"
             :headers.sync="headers"
             :fetch="fetch"
             immediate
             draggable
    >
      <el-table-column slot="avatar" label="头像" width="80">
        <template v-slot="{row}">
          <img height="50" width="50" :src="row.avatar">
        </template>
      </el-table-column>
      <template v-slot:name>
        <el-table-column label="姓名">
          <template v-slot:default="{row}">
            {{ row.name }}
          </template>
        </el-table-column>
      </template>
      <el-table-column slot="ip">
        <!-- 使用自定义插槽 且 需要过滤功能时，可以使用 GTableColumnHeader 组件 -->
        <g-table-column-header slot="header" label="ip地址" prop="ip" />
        <template v-slot="{row}">
          {{ row.ip }}
        </template>
      </el-table-column>
    </g-table>
  </div>
</template>

<script>
import getData from '@/util/getData'

export default {
  data() {
    return {
      headers: [
        { type: 'selection' },
        { label: '头像', slot: true, slotName: 'avatar', group: '组1' },
        { label: '姓名', slot: true, slotName: 'name', visible: true, group: '组2' },
        { label: '账号', prop: 'account', visible: true, group: '组1', filter: true },
        { label: '年龄', prop: 'age', visible: false, group: '组2' },
        { label: '邮箱', prop: 'email', visible: false, group: '组2' },
        { label: '更新时间', prop: 'datetime', visible: true, group: '组1', filter: true },
        { label: 'ip地址', slot: true, slotName: 'ip', visible: true }
      ]
    }
  },
  methods: {
    fetch({ current, size }) {
      return Promise.resolve({
        total: 100,
        size,
        records: getData(size)
      })
    }
  }
}
</script>
