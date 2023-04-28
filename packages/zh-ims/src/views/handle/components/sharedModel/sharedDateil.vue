<template>
  <!-- 共享库存详情 -->
  <basic-container ref="box" v-loading="loading">
    <el-collapse v-model="activeNames">
      <el-collapse-item ref="infoBox" title="库存共享详情" name="1">
        <el-form label-width="100px" size="mini" class="no-message" :model="sharedData" disabled>
          <el-row :gutter="30">
            <el-col :span="8">
              <el-form-item label="共享编码">
                <el-input :value="sharedData.info.sharingCode" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="共享方(货权)">
                <el-input :value="sharedData.info.productAuthName" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="共享方(货主)">
                <el-input :value="sharedData.info.productOwnerName" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="共享仓库">
                <el-input :value="sharedData.info.warehouse.warehouseName" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="共享租户范围">
                <el-input :value="sharingScopeObj[sharedData.info.sharingTenantsScope]" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="共享产品范围">
                <el-input :value="sharingScopeObj[sharedData.info.sharingProductsScope]" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="共享人">
                <el-input :value="sharedData.info.sharingUserName" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="共享时间">
                <el-input :value="sharedData.info.sharingTime" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="创建时间">
                <el-input :value="sharedData.info.createTime" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-collapse-item>

      <el-collapse-item v-show="sharedData.tenants.length" ref="tenantsBox" title="共享租户范围" name="2">
        <div style="width:50%">
          <el-table :data="sharedData.tenants" size="mini" max-height="350px" stripe style="width: 100%" border>
            <el-table-column prop="productAuthName" label="分销方(货权)" align="center" min-width="130" />
            <el-table-column prop="productOwnerId" label="分销方(货主)" align="center" min-width="130">
              <template slot-scope="scope">
                <span>{{ scope.row.productOwnerId==-1?'全部':'' }}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-collapse-item>

      <el-collapse-item v-show="sharedData.products.length" ref="productBox" title="共享产品范围" name="3">
        <el-table :data="sharedData.products" size="mini" max-height="350px" stripe style="width: 100%" border>
          <el-table-column prop="productSku" label="产品编码" align="center" min-width="110" />
          <el-table-column prop="imageUrl" label="产品图片" align="center" width="70">
            <template slot-scope="scope">
              <g-thumb class="d-table-cell" :url="scope.row.skuInfo.imageUrl" />
            </template>
          </el-table-column>
          <el-table-column prop="skuInfo.productName" label="产品名称" align="center" min-width="120">
            <template slot-scope="scope">
              <g-text-ellipsis :lines="2">{{ scope.row.skuInfo.productName }}</g-text-ellipsis>
            </template>
          </el-table-column>
          <el-table-column prop="skuInfo.categoryPath" label="产品类目" align="center" min-width="90">
            <template slot-scope="scope">
              <g-text-ellipsis :lines="2">{{ scope.row.skuInfo.categoryPath }}</g-text-ellipsis>
            </template>
          </el-table-column>
          <el-table-column prop="sharingQuantity" label="共享数量" align="center" min-width="90">
            <template slot-scope="scope">
              <span>{{ scope.row.sharingQuantity==-1?'全部':scope.row.sharingQuantity }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="priceBeforeSharing" label="共享前价格" align="center" min-width="90">
            <template slot-scope="scope">
              <span>{{ isHas(scope.row.priceBeforeSharing) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="priceAfterSharing" label="共享后价格" align="center" min-width="90">
            <template slot-scope="scope">
              <span>{{ isHas(scope.row.priceAfterSharing) }}</span>
            </template>
          </el-table-column>
        </el-table>
      </el-collapse-item>

      <el-collapse-item title="分销汇总" name="4">
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
              <template slot-scope="scope">
                <g-text-ellipsis :lines="2">{{ scope.row.skuInfo.productName }}</g-text-ellipsis>
              </template>
            </el-table-column>

            <!-- 产品类目 -->
            <el-table-column slot="categoryPath" label="产品类目" align="center" min-width="120">
              <template slot-scope="scope">
                <g-text-ellipsis :lines="2">{{ scope.row.skuInfo.categoryPath }}</g-text-ellipsis>
              </template>
            </el-table-column>

            <!-- 货权 -->
            <el-table-column slot="productAuthName" label="分销方(货权)" align="center" min-width="100">
              <template slot-scope="scope">
                <g-text-ellipsis :lines="2">{{ scope.row.productAuthName }}</g-text-ellipsis>
              </template>
            </el-table-column>

            <!-- 产品类目 -->
            <el-table-column slot="productOwnerName" label="分销方(货主)" align="center" min-width="100">
              <template slot-scope="scope">
                <g-text-ellipsis :lines="2">{{ scope.row.productOwnerName }}</g-text-ellipsis>
              </template>
            </el-table-column>

            <!-- 共享前价格 -->
            <el-table-column slot="sharingQuantity" label="共享数量" align="center" min-width="90">
              <template slot-scope="scope">
                <span>{{ scope.row.sharingQuantity==-1?'全部':isHas(scope.row.sharingQuantity) }}</span>
              </template>
            </el-table-column>
            <!-- 分销数量 -->
            <el-table-column slot="distributionQuantity" label="分销数量" align="center" min-width="90">
              <template slot-scope="scope">
                <span>{{ isHas(scope.row.distributionQuantity) }}</span>
              </template>
            </el-table-column>
            <!-- 分销金额 -->
            <el-table-column slot="distributionAmount" label="分销金额" align="center" min-width="90">
              <template slot-scope="scope">
                <span>{{ isHas(scope.row.distributionAmount) }}</span>
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

      </el-collapse-item>
    </el-collapse>
  </basic-container>

</template>

<script>
import { getDetail, getPageSummary } from '@/api/handle/shared.js'
import distribution from './distribution.vue'

export default {
  name: 'SharedDateil',
  props: {
    sharedDateil: Object
  },
  data() {
    return {
      loading: false,
      sharedData: {
        info: { warehouse: {} },
        tenants: [],
        products: []
      },
      sharingScopeObj: {
        ALL: '全部',
        PART: '部分'
      },
      activeNames: ['1', '2', '3', '4'],
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
          slotName: 'sharingQuantity'
        },
        {
          slot: true,
          slotName: 'priceBeforeSharing'
        },
        {
          slot: true,
          slotName: 'priceAfterSharing'
        },
        {
          slot: true,
          slotName: 'distributionQuantity'
        },
        {
          slot: true,
          slotName: 'distributionAmount'
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
    this.getData()
    this.$refs.table.load(1, { sharingId: this.sharedDateil.id })
  },
  methods: {
    getData() {
      getDetail(this.sharedDateil.id).then(res => {
        this.sharedData = res.data
      })
    },
    isHas(val) {
      if (val === -1 || (!val && val !== 0)) {
        return ''
      } else {
        return val
      }
    },
    fetch({ current, size }, params) {
      return getPageSummary(current, size, params).then(res => {
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
      const tenantsHeight = this.$refs.tenantsBox.$el.clientHeight || 0
      const productHeight = this.$refs.productBox.$el.clientHeight || 0
      if (allHeight < (infoHeight + tenantsHeight + productHeight + 500)) {
        return 400
      } else {
        return (allHeight - (infoHeight + tenantsHeight + productHeight + 80))
      }
    },
    detailBtn(val) {
      this.$newTab({
        path: '/handle/shared/dateil/distribution',
        title: '产品分销数据',
        component: distribution,
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
::v-deep .el-collapse-item__header{
  padding: 0 30px;
  font-weight: 600;
  ::v-deep .el-collapse-item__arrow{
    margin: 0 auto 0 20px;
    font-weight: 600;
  }
}
</style>
