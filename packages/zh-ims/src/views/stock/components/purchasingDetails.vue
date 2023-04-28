<template>
  <!-- 采购中 -->
  <div v-loading="loading" style="width:100%;height:100%">
    <g-table ref="table" :headers="headers" :fetch="fetch" row-key="id">
      <template slot="header">
        <el-form label-width="80px" size="mini" class="no-message">
          <el-row>
            <el-col :span="12">
              <el-form-item prop="purOrderCode" label="采购编码">
                <el-input v-model.trim="submit.purOrderCode" clearable placeholder="请填写" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item class="btnBox">
                <el-button type="primary" size="mini" icon="el-icon-search" @click="initialization">查询</el-button>
                <el-button icon="el-icon-delete" size="mini" @click="reset()">重置</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </template>
    </g-table>

  </div>
</template>

<script>
import { getPurchasingDetail } from '@/api/stock/view.js'
import { deepClone } from '@/util/util'

export default {
  name: 'PurchasingDetails',
  props: {
    id: String
  },
  data() {
    return {
      loading: false,
      submit: {
        stockId: this.id,
        purOrderCode: ''
      },
      submitData: {},
      // 表格数据
      headers: [
        {
          label: '采购编码',
          prop: 'purOrderCode',
          showOverflowTooltip: true,
          minWidth: '200px',
          align: 'center'
        },
        {
          label: '采购人',
          prop: 'purchaseUserName',
          showOverflowTooltip: true,
          minWidth: '150px',
          align: 'center'
        },
        {
          label: '采购中数量',
          prop: 'purchasingQty',
          showOverflowTooltip: true,
          minWidth: '150px',
          align: 'center'
        }
      ]
    }
  },
  mounted() {
    this.initialization()
  },
  methods: {
    // 初始化数据
    fetch({ current, size }, params) {
      return getPurchasingDetail(current, size, params).then(res => {
        return {
          records: res.data.records, // 列表数据
          total: res.data.total, // 总记录数
          size: res.data.pageSize // 每页最大记录数
        }
      })
    },
    initialization() {
      this.submitData = deepClone(this.submit)
      this.$refs.table.load(1, this.submitData)
    },
    reset() {
      this.submit.purOrderCode = ''
      this.initialization()
    }
  }
}
</script>
<style lang="scss" scoped>
.btnBox{
  ::v-deep .el-form-item__content{
    margin-left: 10px!important;
  }
}
</style>
