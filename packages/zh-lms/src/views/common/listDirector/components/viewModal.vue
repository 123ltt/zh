<template>
  <g-table ref="table" :headers="headers" :fetch="fetch" row-key="id" :page-size="10">
    <el-table-column slot="content" label="修改内容" width="300">
      <template v-slot="{ row }">
        <div class="log-listing-content text-wrap" v-html="row.content" />
      </template>
    </el-table-column>
  </g-table>
</template>

<script>
import { dataOpsLog } from '@/api/common.js'
export default {
  name: 'ViewModal',
  props: {
    id: String
  },
  data() {
    return {
      form: {
        module: 'LISTING_USER'
      },
      headers: [
        { slot: true, slotName: 'content' },
        { prop: 'createUserName', label: '修改人' },
        { prop: 'createTime', slotName: '修改时间' }
      ]
    }
  },
  mounted() {
    this.form.relationId = this.id
    this.$refs.table.load(1, this.form)
  },
  methods: {
    fetch({ current, size }, params) {
      return dataOpsLog({ current, size }, { ...params }).then(res => {
        const data = res.data
        data.records.forEach(item => {
          item.content = item.content.replace(';', '<br/>')
        })
        return {
          records: data.records, // 列表数据
          total: data.total, // 总记录数
          size: data.size // 每页最大记录数
        }
      })
    }
  }

}
</script>

<style>

</style>
