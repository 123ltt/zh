<template>
  <basic-container style="min-width: 0">
    <g-table ref="table" :headers="headers" row-key="id" :fetch="fetch" />
  </basic-container>
</template>

<script>
import { deepClone } from '@/util/util'
import { getLogList } from '@/api/walmart/attribute'

export default {
  name: 'ChildAttrLog',
  props: {
    row: Object
  },
  data() {
    return {
      headers: [
        {
          label: '修改内容',
          prop: 'content'
        },
        {
          label: '修改人',
          prop: 'createUserName'
        },
        {
          label: '修改时间',
          prop: 'createTime'
        }
      ],
      form: {}
    }
  },
  created() {
    this.form = deepClone(this.row)
  },
  mounted() {
    const { id: relationId } = this.form
    this.$refs.table.load(1, { relationId, module: 'WalmartAttributeBind', descs: 'create_time' })
  },
  methods: {
    fetch({ current, size }, params) {
      return getLogList({ current, size, ...params }).then(res => {
        return {
          records: res.data.records, // 列表数据
          total: res.data.total, // 总记录数
          size: res.data.size // 每页最大记录数
        }
      })
    },
    cancel() {
      this.$parent.$emit('close')
    }
  }
}
</script>
