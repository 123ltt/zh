<template>
  <div>
    <el-table :ref="`tableChild${aliExpressListingItem.id}`" tooltip-effect="dark" border stripe highlight-current-row :data="tableDataChildRen" class="g-table g-table-dense">
      <el-table-column label="子SKU" prop="name" width="450px">
        <template slot-scope="{row}">
          <span class="d-block">SKU：<g-link class="text-primary" @click="openSpuSkuDetail(row.productSku, row.productSku)">{{ row.productSku }}</g-link></span>
          <span class="d-block">平台SKU：{{ row.sellerSku }}</span>
        </template>
      </el-table-column>
      <el-table-column label="库存" prop="ipmSkuStock" />
      <el-table-column label="成本(CNY)" prop="costPrice" />
      <el-table-column label="售价(USD)" prop="skuPrice" />
    </el-table>
  </div>
</template>

<script>
import { openSpuSkuDetail } from '@/views/components/utils.js'
export default {
  name: 'LmsAliExpressListChild',
  props: {
    aliExpressListingItem: { // 父sku obj
      type: Object,
      default: () => { return {} }
    },
    auditTabActiveNum: { // 产品状态
      type: Number
    },
    auditTabActiveName: {
      type: String
    },
    tableDataChildRen: { // 子sku 列表数据
      type: Array
    }
  },
  data() {
    return {
      openSpuSkuDetail,
      productStatusName: ['Draft', 'Approving', 'Uploading', 'Upload Failed', 'Online', 'Updating', 'Update Failed', 'Match Failed', 'Canceling', 'Canceled'],
      checked: false, // head 勾选
      isIndeterminate: false
    }
  },
  methods: {
    changeCheckStatusIfParentChange(isSelect) {
      // 全选 半选效果就为假
      this.isIndeterminate = false
      this.checked = isSelect
      this.tableDataChildRen.forEach(item => {
        if (item.isSelect !== isSelect) {
          item.isSelect = isSelect
        }
      })
    }
  }
}
</script>
