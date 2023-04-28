<template>
  <el-table v-loading="loading" :data="recordData" size="mini" height="400px" stripe style="width: 100%" border class="g-table">
    <el-table-column prop="rqmtCode" label="备货编码" align="center" min-width="130" show-overflow-tooltip />
    <el-table-column prop="status" label="单据状态" align="center" min-width="90">
      <template slot-scope="{row}">
        <span>{{ statusObj[row.status] }}</span>
      </template>
    </el-table-column>
    <el-table-column prop="rqmtTotalQty" label="需求数量" align="center" min-width="100" />
    <el-table-column prop="createUserName" label="创建人" align="center" min-width="100" />
    <el-table-column prop="createTime" label="创建时间" align="center" min-width="150" />
  </el-table>
</template>

<script>

import { getReqList } from '@/api/warningManagement/stockoos.js'
import { dictionary } from '@/api/commonApi.js'

export default {
  name: 'ProcureDetail',
  props: {
    detailData: Object
  },
  data() {
    return {
      recordData: [],
      statusObj: {},
      loading: false
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    async getData() {
      this.loading = true
      await dictionary('ips_rqmt_status').then(res => {
        res.data.forEach(item => {
          this.statusObj[item.dictKey] = item.dictValue
        })
      })
      await getReqList(this.detailData.id).then(res => {
        this.recordData = res.data
        this.loading = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-form-item{
  margin-bottom: 10px!important;
}
.caozuo{
  ::v-deep .el-table td, .el-table th{
    padding: 5px 0;
  }
}

.cardBox{
  ::v-deep .el-card__body{
    padding-bottom: 0;
  }
}

.hiddenWord{
    display: -webkit-box;
    overflow: hidden;
    white-space: normal !important;
    text-overflow: ellipsis;
    word-wrap: break-word;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical
}
</style>
