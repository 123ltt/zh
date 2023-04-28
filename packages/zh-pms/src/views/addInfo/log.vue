// 日志信息
<template>
  <g-table ref="table" row-key="id" :headers="headers" :fetch="fetch" :diff-height="2">
    <el-table-column slot="header">
      <el-card>
        <h4 slot="header" class="my-1">产品处理人信息</h4>
        <el-form inline size="mini" label-width="120px" disabled class="no-message form-readonly">
          <div>
            <el-form-item label="安全审核人">
              <el-input v-model="form.safeAuditUserName" />
            </el-form-item>
            <el-form-item label="开发专员">
              <el-input v-model="form.developUserName" />
            </el-form-item>
            <el-form-item label="采购人员">
              <el-input v-model="form.purchaseUserName" />
            </el-form-item>

          </div>
          <div>
            <el-form-item label="物流审核人">
              <el-input v-model="form.logisticsAuditUserName" />
            </el-form-item>
            <el-form-item label="开发人上级">
              <el-input v-model="form.developMasterUserName" />
            </el-form-item>
          </div>
          <!-- <div>
          <el-form-item label="图片审核人：">
            <el-input v-model="form.picAuditUserName" />
          </el-form-item>
        </div> -->
        </el-form>
      </el-card>
    </el-table-column>
    <el-table-column slot="msgBrief" label="结果">
      <template slot-scope="{row}">
        <g-text-ellipsis>{{ row.msgBrief }}</g-text-ellipsis>
      </template>
    </el-table-column>
  </g-table>
</template>

<script>
import { getLogList } from '@/api/info'

export default {
  props: {
    formData: Object,
    // 类型， 0 SPU，1 SKU，2 组合SKU，3 产品开发，4 美工任务
    type: [Number, String]
  },
  data() {
    return {
      form: Object.assign({}, this.formData),
      headers: [
        { label: '修改人', prop: 'createUserName', width: 160 },
        { label: '修改时间', prop: 'createTime', width: 160 },
        { label: '操作类型', prop: 'loggerDesc', width: 180 },
        { slot: true, slotName: 'msgBrief' }
      ]
    }
  },
  mounted() {
    this.$refs.table.load(1)
  },
  methods: {
    fetch(page) {
      const params = {
        bizNo: this.formData.id,
        entityCode: ['SPU', 'SKU', 'COMBINE_SKU', 'NEW_PRODUCT', 'ART_DESIGNER_TASK'][Number(this.type)]
      }
      return getLogList(Object.assign(page, params)).then(res => res.data)
    }
  }
}
</script>
