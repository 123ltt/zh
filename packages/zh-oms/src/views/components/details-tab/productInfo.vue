<template>
  <!-- oms 详情 - 产品信息 -->
  <g-table ref="table"
           :headers="headers"
           row-key="id"
           :fetch="fetch"
  >
    <el-table-column slot="productPicUrlSlot" label="缩略图" width="72" align="center">
      <template slot-scope="{row}">
        <g-thumb :url="row.productPicUrl" />
      </template>
    </el-table-column>

    <el-table-column slot="specificationsSlot" label="产品信息" width="190px">
      <template slot-scope="{row:{pmsSku,productsName}}">
        <g-list-group>
          <g-list-group-item label="SKU编码">
            <g-text-ellipsis>{{ pmsSku }}</g-text-ellipsis></g-list-group-item>
          <g-list-group-item label="名称">
            <g-text-ellipsis :lines="2">{{ productsName }}</g-text-ellipsis>
          </g-list-group-item>
        </g-list-group>
      </template>
    </el-table-column>

    <el-table-column slot="onlineProductCodeSlot" label="在线商品信息" width="220px">
      <template slot-scope="{row:{platformProductId,originalSkuCode,originalSkuName,location}}">
        <g-list-group>
          <g-list-group-item label="Item">
            <g-text-ellipsis>{{ platformProductId }}</g-text-ellipsis>
          </g-list-group-item>
          <g-list-group-item label="在线SKU">
            <g-text-ellipsis>{{ originalSkuCode }}</g-text-ellipsis>
          </g-list-group-item>
          <g-list-group-item label="名称">
            <g-text-ellipsis>{{ originalSkuName }}</g-text-ellipsis>
          </g-list-group-item>
          <g-list-group-item label="Location">
            <g-text-ellipsis>{{ location }}</g-text-ellipsis>
          </g-list-group-item>
        </g-list-group>
      </template>
    </el-table-column>

    <el-table-column slot="logisticsPropertyNameSlot" label="SKU物流属性" width="140px">
      <template slot-scope="{row:{logisticsPropertyName:listArr}}">
        <g-text-ellipsis v-for="(item, i) in listArr.slice(0, 3)" :key="i" :lines="listArr.length==1?3:1">{{ `${listArr.length?(i+1)+'、':''}` }}{{ item.replace(/(\/)/g, ' $1 ') }}</g-text-ellipsis>

        <el-popover
          v-if="listArr.length>3"
          placement="right"
          width="300"
          trigger="hover"
        >
          <div style="max-height: 400px; overflow-y: auto;">
            <g-text-ellipsis v-for="(item, i) in listArr" :key="i" class="mb-1">
              {{ i+1 + '、'+ item.replace(/(\/)/g, ' $1 ') }}
            </g-text-ellipsis>
          </div>
          <span slot="reference" class="text-primary" style="cursor: default;">更多</span>
        </el-popover>
      </template>
    </el-table-column>

    <el-table-column slot="saleInfoSlot" label="销售信息" width="156px">
      <template slot-scope="{row:{productSalePrice, productQuantity,lackNum}}">
        <g-list-group>
          <g-list-group-item label="单价">{{ formatterMoney(productSalePrice) }}
          </g-list-group-item>
          <g-list-group-item label="数量">
            {{ productQuantity }}  <span v-if="lackNum" class="text-danger">(缺货:{{ lackNum }})</span>
          </g-list-group-item>
          <g-list-group-item label="销售金额">{{ formatterMoney(productSalePrice * productQuantity) }}
          </g-list-group-item>
        </g-list-group>
      </template>
    </el-table-column>

    <el-table-column slot="relevantPersonnelSlot" label="关联人员" width="156px">
      <template slot-scope="{row}">
        <div>客服：{{ row.mainCustomerServiceName }}</div>
        <div>销售：{{ row.mainSellerName }}</div>
        <div>开发：{{ row.developLeadUserName }}</div>
      </template>
    </el-table-column>

    <el-table-column slot="reasonDetailSlot" label="具体原因">
      <template slot-scope="{row}">
        <g-text-ellipsis :lines="3">{{ row.reasonDetail }}</g-text-ellipsis>
      </template>
    </el-table-column>

    <el-table-column v-if="buttonInfo.saveOrUpdateGood" slot="handler" label="操作" width="60">
      <template slot-scope="{row, $index}">
        <el-button type="text" @click="updateProduct(row, omOrderId,packageCode, detailsType, $index, true)">修改</el-button><br>
        <el-button type="text" @click="deleteProduct(row.id, omOrderId, packageCode, $index)">删除</el-button>
      </template>
    </el-table-column>
  </g-table>
</template>

<script>
import { getProductList, deleteOrderGood } from '@/api/orderManagement'
import { getPackageProductList, deletePackageGood } from '@/api/packageDetails'
export default {
  name: 'ProductInfo',
  props: {
    omOrderId: String,
    packageCode: String,
    /** @type {ZHKJ.VueProps<'order'|'package'>} */
    detailsType: String,
    /** @type {ZHKJ.VueProps<(id?:string, omOrderId:string, packageCode:string, detailsType:string)=>void>} */
    updateProduct: Function,
    /** @type {ZHKJ.VueProps<{saveOrUpdateGood:Boolean}>} */
    buttonInfo: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      headers: [
        { type: 'index', label: '序号' },
        { slot: true, slotName: 'productPicUrlSlot' },
        { slot: true, slotName: 'specificationsSlot' },
        { slot: true, slotName: 'onlineProductCodeSlot' },
        { slot: true, slotName: 'logisticsPropertyNameSlot' },
        { label: '产品重量（g）', prop: 'grossWeight', width: '114px' },
        { slot: true, slotName: 'saleInfoSlot' },
        { slot: true, slotName: 'relevantPersonnelSlot' },
        { label: '原因分类', prop: 'reasonTypeName' },
        { slot: true, slotName: 'reasonDetailSlot' },
        { slot: true, slotName: 'handler' }
      ]
    }
  },
  mounted() {
    this.search()
  },
  methods: {
    search(page = 1) {
      const { detailsType, omOrderId, packageCode } = this
      const id = detailsType === 'order' ? omOrderId : packageCode
      this.$refs.table.load(page, id)
    },
    formatterMoney(price) {
      let res = 'USD '
      if (price === '0.0') {
        res += 0
      } else if (price === null || price === undefined) {
        res += price
      } else {
        res += parseFloat(price).toFixed(2)
      }
      return res
    },
    fetch({ current, size }, id) {
      const { detailsType } = this
      const query = {
        order: getProductList,
        package: getPackageProductList
      }[detailsType]
      const params = { current, size }
      params[detailsType === 'order' ? 'omOrderId' : 'packageCode'] = id

      return query(params).then(res => {
        return {
          records: res.data.records || [], // 列表数据
          total: res.data.total, // 总记录数
          size: res.data.size // 每页最大记录数
        }
      })
    },
    deleteProduct(id, omOrderId, packageCode, index) {
      this.$confirm('确定要删除该商品?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        const { detailsType } = this
        if (detailsType === 'package') {
          this.$refs.table.tableList.splice(index, 1)
          this.$emit('delProduct')
          this.$message.success('删除成功，请勿刷新当前页面')
          return
        }
        const deleteGood = {
          order: deleteOrderGood,
          package: deletePackageGood
        }[detailsType]
        const code = detailsType === 'order' ? omOrderId : packageCode

        deleteGood(id + '', code).then(res => {
          this.$message.success(res.msg || '')
          this.$refs.table.load(-1, code)
        })
      }).catch(() => { })
    }
  }
}
</script>
