<template>
  <el-table :ref="`tableChild${ebayListingItem.id}`" tooltip-effect="dark" border stripe highlight-current-row :data="tableDataChildRen" class="g-table g-table-dense">
    <el-table-column label="子SKU" prop="name">
      <template slot-scope="{row}">
        <span class="d-block">SKU：<g-link class="text-primary" @click="openSpuSkuDetail(row.productSku, row.productSku)">{{ row.productSku }}</g-link></span>
        <span class="d-block">平台SKU：{{ row.sellerSku }}</span>
      </template>
    </el-table-column>
    <el-table-column label="主图" width="76px">
      <template slot-scope="{ row }">
        <g-thumb :url="row.mainPicture" />
      </template>
    </el-table-column>
    <template>
      <el-table-column label="状态" prop="name" width="100">
        <template slot-scope="{row}">
          {{ row.listingStatus?'Published':'Draft' }}
        </template>
      </el-table-column>
    </template>
    <el-table-column label="时间" prop="name" width="168">
      <template>
        <span class="d-block">创建:{{ ebayListingItem.createTime }}</span>
        <span v-if="showUpOnlineTime" class="d-block">上架:{{ ebayListingItem.publishTime }}</span>
      </template>
    </el-table-column>
    <el-table-column label="库存" prop="stock" width="80" />
    <el-table-column label="成本" prop="costPrice" width="80" />
    <el-table-column label="售价" prop="startPrice" width="80" />
  </el-table>
</template>

<script>
import { openSpuSkuDetail } from '@/views/components/utils.js'
export default {
  name: 'LmsAmazonAmazonAmazonListChild',
  props: {
    ebayListingItem: { // 父sku obj
      type: Object,
      default: () => { return {} }
    },
    auditTabActiveNum: { // 产品状态
      type: Number
    },
    auditTabActiveName: {
      type: String
    },
    domainList: { // 根据站点跳到对应后缀域名
      type: Array
    },
    tableDataChildRen: { // 子sku 列表数据
      type: Array
    }
  },
  data() {
    return {
      openSpuSkuDetail,
      multipleSelection: [],
      tableDataId: '', // 子sku 取消某一项勾选，父级sku 去掉勾选
      flag: true,
      checkChildIds: []

    }
  },
  computed: {
    // 上架时间 5-9
    showUpOnlineTime() {
      return ['Online', 'Updating', 'Update Failed', 'Match Failed', 'Canceling'].includes(this.auditTabActiveName)
    }
  }

}
</script>
