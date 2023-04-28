<template>
  <!-- oms 详情 - 包裹订单 -->
  <g-table ref="table"
           :headers="headers"
           row-key="id"
           :fetch="fetch"
  >
    <el-table-column slot="goodsNum" label="数量/SKU">
      <template slot-scope="scope">
        <div>
          <span v-for="(list,index) in scope.row.goodsNum.filter((item,index)=>index<3)" :key="index">
            {{ list }}
          </span>
          <el-popover
            placement="right"
            width="200"
            trigger="hover"
          >
            <div v-for="(item,index) in scope.row.goodsNum" :key="index">
              {{ index+1 }}.{{ item }}
            </div>
            <el-button v-if="scope.row.goodsNum.length>3" slot="reference" type="text">更多</el-button>
          </el-popover>
        </div>
      </template>
    </el-table-column>
    <el-table-column slot="packageCodeSlot" label="包裹单号">
      <template slot-scope="{row}">
        <GLink class="text-primary" @click="toPackageDetails(row.packageCode)">{{ row.packageCode }}</GLink>
      </template>
    </el-table-column>

    <!-- <el-table-column slot="handler" label="操作">
      <template slot-scope="{row}">
        <el-button type="text">删除{{ row.a }}</el-button>
      </template>
    </el-table-column> -->
  </g-table>
</template>

<script>
import { getPackageList as getOrderPackageList } from '@/api/orderManagement'

export default {
  name: 'Logs',
  components: { },
  props: {
    omOrderId: String
  },
  data() {
    return {
      headers: [
        { type: 'index', label: '序号' },
        // { label: '包裹单号', prop: 'packageCode' },
        { slot: true, slotName: 'packageCodeSlot' },
        { label: '包裹状态', prop: 'packageStatusName' },
        { label: '发货状态', prop: 'wmsStatusName' },
        { label: '发货仓', prop: 'warehouseName' },
        { label: '物流渠道', prop: 'channelCode' },
        { slot: true, slotName: 'goodsNum' },
        { label: '试算重量（g）', prop: 'trialWeight' },
        { label: '实际重量（g）', prop: 'weight' }
      ]
    }
  },
  mounted() {
    this.search()
  },
  methods: {
    search(page = 1) {
      this.$refs.table.load(page, this.omOrderId)
    },
    toPackageDetails(packageCode) {
      this.$newPage({
        path: 'oms/packOrders/details/index',
        data: { packageCode }
      })
    },
    fetch({ current, size }, omOrderId) {
      return getOrderPackageList({ current, size, omOrderId }).then(res => {
        res.data.records.forEach(item => {
          item.goodsNum = item.goodsNum.split(',')
        })
        return {
          records: res.data.records || [], // 列表数据
          total: res.data.total, // 总记录数
          size: res.data.size // 每页最大记录数
        }
      })
    }
  }
}
</script>
