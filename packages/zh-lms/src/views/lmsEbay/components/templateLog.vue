<template>
  <basic-container>
    <g-table ref="table" :headers="headers" row-key="id" :fetch="fetch">
      <el-table-column slot="content" label="内容" width="450" class="log-listing">
        <template v-slot="{ row }">
          <el-tooltip v-if="row.optContent && row.optContent.includes(':')" effect="dark" placement="top-start">
            <div slot="content">
              <div class="log-listing-content text-wrap" v-html="row.optContent" />
            </div>
            <pre style="height: 23px;overflow: hidden;text-overflow: ellipsis;" class="overflow-default overflow-hidden" v-html="row.optContent" />
          </el-tooltip>
          <div v-else v-html="row.optContent" />
        </template>
      </el-table-column>
    </g-table>
  </basic-container>
</template>

<script>
import { getLogList } from '@/api/ebay/log.js'
export default {
  name: 'TemplateLog',
  props: {
    row: {
      type: Object
    },
    tempType: { // 模板类型
      type: String
    }
  },
  data() {
    return {
      headers: [{
        label: '序号',
        type: 'index'
      }, {
        label: '模板',
        prop: 'policyName'
      }, {
        slot: true,
        slotName: 'content'
      }, {
        label: '操作人',
        prop: 'createUser'
      }, {
        label: '操作时间',
        prop: 'createTime'
      }],
      form: {
        optBusId: this.row.id
      }

    }
  },
  mounted() {
    this.form.optBus = this.tempType
    this.$refs.table.load(1, this.form)
  },
  methods: {
    fetch({ current, size }, params) {
      return getLogList({ current, size, ...params }).then(res => {
        const data = res.data
        data.records.forEach(item => {
          item.policyName = this.row.policyName
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
