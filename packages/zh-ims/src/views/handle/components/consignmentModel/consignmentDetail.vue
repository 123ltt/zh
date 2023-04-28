<template>
  <!-- 代销详情 -->
  <basic-container ref="box" v-loading="loading">
    <el-card ref="infoBox">
      <div slot="header">
        <span style="font-weight: 600;">基本信息</span>
      </div>
      <el-form label-width="100px" size="mini" class="no-message" :model="detailData">
        <el-row :gutter="30">
          <el-col :span="8">
            <el-form-item label="代销编码">
              <el-input :value="detailData.proxyCode" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="授权方(货权)">
              <el-input :value="detailData.productAuthName" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="授权方(货主)">
              <el-input :value="detailData.productOwnerName" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="仓库类型">
              <el-input :value="detailData.warehouse.warehouseType.desc" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="仓库归属">
              <el-input :value="warehouseBelongObj[detailData.warehouse.warehouseBelong]" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="授权仓库">
              <el-input :value="detailData.warehouse.warehouseName" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="授权数量">
              <el-input :value="detailData.authQty" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="授权人">
              <el-input :value="detailData.proxySaleUserName" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="授权时间">
              <el-input :value="detailData.updateTime" disabled />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card>
      <div slot="header">
        <span style="font-weight: 600;">代销明细</span>
      </div>
      <div :style="{ height: maxHeight + 'px' }">
        <g-table ref="table" :headers="headers" :fetch="fetch" row-key="id">

          <!-- 产品图片 -->
          <el-table-column slot="imageUrl" label="产品图片" align="center" width="70">
            <template slot-scope="scope">
              <g-thumb class="d-table-cell" :url="scope.row.skuInfo.imageUrl" />
            </template>
          </el-table-column>

          <!-- 产品名称 -->
          <el-table-column slot="productName" label="产品名称" align="center" min-width="120">
            <template v-slot="{row}">
              <g-text-ellipsis :lines="2">{{ row.skuInfo.productName }}</g-text-ellipsis>
            </template>
          </el-table-column>

          <!-- 产品类目 -->
          <el-table-column slot="categoryPath" label="产品类目" align="center" min-width="120">
            <template v-slot="{row}">
              <g-text-ellipsis :lines="2">{{ row.skuInfo.categoryPath }}</g-text-ellipsis>
            </template>
          </el-table-column>

          <!-- 货权 -->
          <el-table-column slot="productAuthName" label="代销方(货权)" align="center" min-width="120">
            <template v-slot="{row}">
              <g-text-ellipsis :lines="2">{{ row.productAuthName }}</g-text-ellipsis>
            </template>
          </el-table-column>

          <!-- 货主 -->
          <el-table-column slot="productOwnerName" label="代销方(货主)" align="center" min-width="120">
            <template v-slot="{row}">
              <g-text-ellipsis :lines="2">{{ row.productOwnerName }}</g-text-ellipsis>
            </template>
          </el-table-column>

          <!-- 授权数量 -->
          <el-table-column slot="authQty" label="授权数量" align="center" min-width="80">
            <template slot-scope="scope">
              <span>{{ isHas(scope.row.authQty) }}</span>
            </template>
          </el-table-column>
          <!-- 授权前单价 -->
          <el-table-column slot="priceBeforeAuth" label="授权前单价" align="center" min-width="90">
            <template slot-scope="scope">
              <span>{{ isHas(scope.row.priceBeforeAuth) }}</span>
            </template>
          </el-table-column>
          <!-- 授权后单价 -->
          <el-table-column slot="priceAfterAuth" label="授权后单价" align="center" min-width="90">
            <template slot-scope="scope">
              <span>{{ isHas(scope.row.priceAfterAuth) }}</span>
            </template>
          </el-table-column>
          <!-- 代销数量 -->
          <el-table-column slot="changeQty" label="代销数量" align="center" min-width="80">
            <template slot-scope="scope">
              <span>{{ isHas(scope.row.changeQty) }}</span>
            </template>
          </el-table-column>
          <!-- 代销金额 -->
          <el-table-column slot="proxyAmount" label="代销金额" align="center" min-width="80">
            <template slot-scope="scope">
              <span>{{ isHas(scope.row.proxyAmount) }}</span>
            </template>
          </el-table-column>

          <!-- 操作 -->
          <el-table-column slot="handler" label="操作" min-width="80px" align="center">
            <template v-slot="{row}">
              <el-button type="text" @click="detailBtn(row)">详情</el-button>
            </template>
          </el-table-column>

        </g-table>
      </div>

    </el-card>
  </basic-container>
</template>

<script>
import { getDetail } from '@/api/handle/consignment.js'
import proxyDetail from './proxyDetail.vue'

export default {
  name: 'ConsignmentDetail',
  props: {
    detailData: Object,
    warehouseBelongObj: Object
  },
  data() {
    return {
      loading: false,
      maxHeight: '',
      headers: [
        {
          label: '产品编码',
          prop: 'productSku',
          minWidth: '110px',
          align: 'center'
        },
        {
          slot: true,
          slotName: 'imageUrl'
        },
        {
          slot: true,
          slotName: 'productName'
        },
        {
          slot: true,
          slotName: 'categoryPath'
        },
        {
          slot: true,
          slotName: 'productAuthName'
        },
        {
          slot: true,
          slotName: 'productOwnerName'
        },
        {
          slot: true,
          slotName: 'authQty'
        },
        {
          slot: true,
          slotName: 'priceBeforeAuth'
        },
        {
          slot: true,
          slotName: 'priceAfterAuth'
        },
        {
          slot: true,
          slotName: 'changeQty'
        },
        {
          slot: true,
          slotName: 'proxyAmount'
        },
        {
          slot: true,
          slotName: 'handler'
        }
      ]
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.maxHeight = this.getHeight()
    })
    this.$refs.table.load(1, { id: this.detailData.id })
  },
  methods: {
    isHas(val) {
      if (val === -1 || (!val && val !== 0)) {
        return ''
      } else {
        return val
      }
    },
    fetch({ current, size }, params) {
      return getDetail(current, size, params).then(res => {
        return {
          records: res.data.records, // 列表数据
          total: res.data.total, // 总记录数
          size: res.data.pageSize // 每页最大记录数
        }
      })
    },
    getHeight() {
      const allHeight = this.$refs.box.$el.clientHeight
      const infoHeight = this.$refs.infoBox.$el.clientHeight || 0
      if (allHeight < (infoHeight + 500)) {
        return 400
      } else {
        return (allHeight - (infoHeight + 30))
      }
    },
    detailBtn(val) {
      this.$newTab({
        path: '/handle/consignment/proxyDetail',
        title: '产品代销数据',
        component: proxyDetail,
        data: {
          distriData: val
        },
        clearCache: true,
        callback: () => {}
      })
    }

  }
}
</script>
<style lang="scss" scoped>

</style>
