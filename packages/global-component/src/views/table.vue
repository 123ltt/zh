<template>
  <div style="height:430px">
    <g-table ref="table"
             row-key="id"
             :headers.sync="headers"
             :fetch="fetch"
             immediate
             draggable
    >

      <!-- 此处可以修改自定义列界面 左侧部分（可以取消下面的注释试试） -->
      <!-- <template v-slot:custom-column-body="{data}">
        <pre>
          {{ JSON.stringify(data) }}
        </pre>
      </template> -->

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
        { label: '邮箱', prop: 'email', visible: false, group: '组2', filter: true },
        { label: '更新时间', prop: 'datetime', visible: true, group: '组1', filter: true },
        { label: 'ip地址', slot: true, slotName: 'ip', visible: true },
        { label: '年龄1', prop: 'age1', visible: false },
        { label: '年龄2', prop: 'age2', visible: false },
        { label: '年龄3', prop: 'age3', visible: false },
        { label: '年龄4', prop: 'age4', visible: false },
        { label: '年龄5年龄5年龄5年龄5年龄5年龄5', prop: 'age5', visible: false },
        { label: '年龄6', prop: 'age6', visible: false },
        { label: '年龄7', prop: 'age7', visible: false },
        { label: '年龄8', prop: 'age8', visible: false },
        { label: '年龄9', prop: 'age9', visible: false },
        { label: '年龄10', prop: 'age10', visible: false },
        { label: '年龄11', prop: 'age11', visible: false },
        { label: '年龄12', prop: 'age12', visible: false },
        { label: '年龄13', prop: 'age13', visible: false },
        { label: '年龄14', prop: 'age14', visible: false },
        { label: '年龄15', prop: 'age15', visible: false },
        { label: '年龄16', prop: 'age16', visible: false },
        { label: '年龄17', prop: 'age17', visible: false }
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
