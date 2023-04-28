<template>
  <div style="height:400px">
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
      <el-table-column slot="ip" label="ip地址">
        <template v-slot="{row}">
          {{ row.ip }}
        </template>
      </el-table-column>
    </g-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      headers: [
        { type: 'selection' },
        { label: '头像', slot: true, slotName: 'avatar', group: '组1' },
        { label: '姓名', slot: true, slotName: 'name', visible: true, group: '组2' },
        { label: '账号', prop: 'account', visible: true, group: '组1' },
        { label: '年龄', prop: 'age', visible: false, group: '组2' },
        { label: '邮箱', prop: 'email', visible: false, group: '组2' },
        { label: '更新时间', prop: 'datetime', visible: true, group: '组1' },
        { label: 'ip地址', slot: true, slotName: 'ip', visible: true }
      ]
    }
  },
  methods: {
    fetch({ current, size }) {
      return fetch(`http://localhost:3300/api/all?size=${size}`)
        .then(res => res.json())
        .then(res => {
          return {
            total: 100,
            size,
            records: res.data
          }
        })
    }
  }
}
</script>
